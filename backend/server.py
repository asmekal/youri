from pydantic import BaseModel
import os
import json

from api import llm_reply
from gemini import summarize_all_files, repeat_until_success
from cache import local_cache

class UserIntentModel(BaseModel):
    user_intent: str

class RenderInfoModel(BaseModel):
    info_to_be_rendered: str
    how_to_render_instruction: str


def extract_code_block(text):
    # Split the input text using the code block delimiter
    code_blocks = text.split('```')
    
    # Check if there are exactly 3 parts (before, code block, after)
    if len(code_blocks) != 3:
        raise ValueError("Input text must contain exactly one code block enclosed by triple backticks.")
    
    # Extract the code block content
    language_and_code = code_blocks[1].split('\n', 1)
    
    # Ensure there's a language identifier followed by code
    if len(language_and_code) != 2 or not language_and_code[0]:
        raise ValueError("The code block must start with a language identifier followed by code.")
    
    # Return the actual code part
    return language_and_code[1].strip()

system_prompt = """
You are building ChatGPT-like system, final output of which should be UX component.
The focus is instead of long text to produce easily digestable, transparent, informative,
highly visual (minimal text), neatly-looking UI component which will be rendered to the
user directly to interact with.
""".strip()

def make_ui_component(user_text, local_file_paths=None, component_name="GeneratedComponent"):
    save_fn = f'../frontent-mock/src/GeneratedComponent.js'
    save_fn2 = f'../frontent-mock/src/generated_components/{component_name}.js'
    # os.makedirs('../frontent-mock/src/generated_components', exist_ok=True)
    log_fn = f'../frontent-mock/logs/{component_name}.json'
    # os.makedirs('../frontent-mock/logs/', exist_ok=True)
    log_record = {}
    log_record["input_text"] = user_text
    log_record["input_files"] = local_file_paths
    log_record["component_name"] = component_name

    # if os.path.exists(save_fn):
    #     print(component_name, "EXISTS, skipping")
    #     return
    try:
        if local_file_paths is not None:
            assert isinstance(local_file_paths, (list, tuple))
            for fn in local_file_paths:
                assert os.path.exists(fn)
            files_attached_summary  = "# Attached files\n\n" + summarize_all_files(local_file_paths)
            user_text += files_attached_summary
        # Step 1: Analyze user_text to guess user intent
        prompt_1 = f"""
        Analyse the following user input and return the user's intent as a specific, well-defined string.

        Raw input:
        ---
        {user_text}
        ---
        
        Reply in proper json of the following format:
        {{'user_intent': ...}}
        """
        # @local_cache
        def get_reply1(prompt=prompt_1, system_prompt=system_prompt, response_format=UserIntentModel):
            return llm_reply(prompt, system_prompt=system_prompt, response_format=response_format)
        user_intent: UserIntentModel = repeat_until_success(get_reply1, max_retries=3)
        # user_intent = UserIntentModel.parse_raw(user_intent_response)
        # print(f"User Intent:\n{user_intent}")
        log_record["user_intent"] = user_intent.user_intent

        # Step 2: Generate a text-only answer relevant to the user intent
        prompt_2 = f"""
        Generate a concise and relevant instruction WHAT TO SHOW AND HOW (plain text), based on the user intent: "{user_intent.user_intent}", and input:
        --- (raw input from user)
        {user_text}
        --- (end of raw input from user)
        You MUST reply in the following format:
        {{
            'info_to_be_rendered': ...,
            'how_to_render_instruction': ...
        }}
        """
        def get_reply2():
            return llm_reply(prompt_2, system_prompt=system_prompt, response_format=RenderInfoModel)
        render_info: RenderInfoModel = repeat_until_success(get_reply2, max_retries=3)
        # render_info = RenderInfoModel.parse_raw(render_info_response)
        print(f"Render Info:\n{render_info}")
        log_record["render_info"] = render_info.model_dump_json()

        # Step 3: Produce the final UI component in React
        prompt_3 = f"""
        Create a UX component using React, ensure it's <100 lines of code.
        Using the following user intent: "{user_intent.user_intent}", and the instruction & information here:
        {render_info}

        Return the code enclosed within: ```...``` (triple code quotes block). The name of component must be {component_name}.
        """
        def get_reply3():
            ui_component_code = llm_reply(prompt_3, system_prompt=system_prompt)
            # ui_component_code = ui_component_code_response.strip("```")
            # print(f"UI Component Code:\n{ui_component_code}")
            ui_component_code = extract_code_block(ui_component_code)
            return ui_component_code
        ui_component_code = repeat_until_success(get_reply3, max_retries=5)
        log_record["ui_component_code"] = ui_component_code
        print('SUCCESS')
        # with open(save_fn, 'w') as f:
        #     f.write(ui_component_code)
        with open(save_fn2, 'w') as f:
            f.write(ui_component_code)
        with open(save_fn, 'w') as f:
            f.write(ui_component_code)
    finally:
        with open(log_fn, 'w') as f:
            json.dump(log_record, f)

# Example usage
# user_text = "snake game"
# make_ui_component(user_text)
# user_file_attached = "../test_data/blood_report.pdf"
# make_ui_component(user_text="", local_file_paths=[user_file_attached])
make_ui_component(user_text="make note taking app with local storage", component_name="NotetakingApp")
