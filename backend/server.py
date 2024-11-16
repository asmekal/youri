from pydantic import BaseModel

from api import llm_reply

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

def make_ui_component(user_text):
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
    user_intent = llm_reply(prompt_1, system_prompt=system_prompt, response_format=UserIntentModel)
    # user_intent = UserIntentModel.parse_raw(user_intent_response)
    print(f"User Intent:\n{user_intent}")

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
    render_info = llm_reply(prompt_2, system_prompt=system_prompt, response_format=RenderInfoModel)
    # render_info = RenderInfoModel.parse_raw(render_info_response)
    print(f"Render Info:\n{render_info}")

    # Step 3: Produce the final UI component in React
    prompt_3 = f"""
    Create a UX component using React, ensure it's <100 lines of code.
    Using the following user intent: "{user_intent.user_intent}", and the instruction & information here:
    {render_info}

    Return the code enclosed within: ```...``` (triple code quotes block). The name of component must be GeneratedComponent.
    """
    ui_component_code = llm_reply(prompt_3, system_prompt=system_prompt)
    # ui_component_code = ui_component_code_response.strip("```")
    print(f"UI Component Code:\n{ui_component_code}")
    ui_component_code = extract_code_block(ui_component_code)
    print('SUCCESS')
    with open('frontent-mock/src/GeneratedComponent.js', 'w') as f:
        f.write(ui_component_code)

# Example usage
user_text = "snake game"
make_ui_component(user_text)
