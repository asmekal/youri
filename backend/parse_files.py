import os
from dotenv import load_dotenv
import json

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

load_dotenv()

assert os.getenv('GOOGLE_API_KEY'), os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))


def generate_response_gemini(prompt: str, model="gemini-1.5-flash") -> str:
    model = genai.GenerativeModel(model)
    response = model.generate_content(prompt)  # TODO: safety check & filters
    # TODO: handle rate limit wait
    return response.text


def generate_response_gemini_multimodal(prompt: list, model="gemini-1.5-flash", max_tokens=None) -> str:
    # here prompt is [googleai_audio_file, googleai_image_file, googleai_any_file, text] (any list of that actually)
    model = genai.GenerativeModel(model)
    generation_config = None
    if max_tokens is not None:
        generation_config = genai.GenerationConfig(max_output_tokens=max_tokens)
    safety_setting = None
    safety_setting = {
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        # HarmCategory.HARM_CATEGORY_UNSPECIFIED: HarmBlockThreshold.BLOCK_NONE,
    }
    response = model.generate_content(prompt, generation_config=generation_config, safety_settings=safety_setting)  # TODO: safety check & filters
    return response.text


def find_file_if_uploaded(path): # TODO: handle page size (>100 files); TODO: handle unique base local names
    simple_name = os.path.basename(path)
    for file in genai.list_files():
        if file.display_name == simple_name:
            return file
    return None

def get_file_upload_if_needed(path):
    cloud_file = find_file_if_uploaded(path)
    if cloud_file is None:
        print(f'file {path} not found, uploading...')
        cloud_file = genai.upload_file(path=path)
    else:
        print(f'file {path} already uploaded')
    return cloud_file

def repeat_until_success(f, *args, max_retries=3, delay=0, **kwargs):
    n_retries = 0
    while True:
        try:
            return f(*args, **kwargs)
        except Exception as e:
            n_retries += 1
            if n_retries < max_retries:
                print(f"str(f) failed with exception {e}, retrying...")
                if delay > 0:
                    import time
                    time.sleep(delay)
            else:
                raise RuntimeError(f"failed {max_retries} times, last error {e}")
            
def get_fixed_str(input_str, start='{', end='}'):
    try:
        # Find the first occurrence of '{' and the last occurrence of '}'
        start = input_str.index(start)
        end = input_str.rindex(end) + 1  # Adding 1 to include the last '}'
        # Extract the substring from '{' to '}'
        return input_str[start:end]
    except ValueError as e:
        raise e

def parse_in_between(text, start="## Upload 1", end="# End of report"):
    # Check if start and end markers occur more than once
    if text.count(start) != 1 or text.count(end) != 1:
        raise ValueError("Either the start or end string occurs more than once in the text.")

    # Find the start and end positions
    start_index = text.index(start)
    end_index = text.index(end)

    # Extract and return the substring, including start but excluding end
    return text[start_index:end_index]

def summarize_all_files(file_paths, model="gemini-1.5-flash", max_tokens=5000):
    prompt = """
Summarize all files given, one by one.
If the file is short (~few pages long) write EVERYTHING possible, include all contents.
If the file is longer than multiple pages - summarize in 1-3 pages. Be sure to include all information which seems important
Write reply as below. Include as many [## Upload [i]] sections as there are files.
You MUST include last "# End of report" at the end of your reply

# Summary

## Upload 1

[Detailed Summary]

...

# End of report
"""
    cloud_files = []
    for file_path in file_paths:
        assert os.path.exists(file_path)
        cloud_file = get_file_upload_if_needed(file_path)
        cloud_files.append(cloud_file)
    def run():
        response = generate_response_gemini_multimodal([cloud_file, prompt], model=model, max_tokens=max_tokens)
        response = parse_in_between(response)
        # response = json.loads(get_fixed_str(response, start='[', end=']'))
        return response
    response = repeat_until_success(run, max_retries=5)
    print(response)
    return response