import instructor
from dotenv import load_dotenv
from pydantic import BaseModel
from groq import Groq
import os

# Load the Groq API key from .env file
load_dotenv()

client_base = Groq(
    # This is the default and can be omitted
    api_key=os.environ.get("GROQ_API_KEY"),
    max_retries=10, # wtf why it does not work with 2 retries even
)
client_structured = instructor.from_groq(client_base, mode=instructor.Mode.JSON)

# Function for extracting data with an LLM
def llm_reply(prompt, model="llama-3.1-70b-versatile", system_prompt=None, history=None, response_format=None, temperature=.65):
    messages = []
    if history:
        messages = history.copy()
    elif system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    kwargs = {}
    if response_format:
        kwargs = {'response_model': response_format}
    client = client_structured if response_format is not None else client_base
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        **kwargs,
    )
    if response_format is None:
        response = response.choices[0].message.content
    
    return response

# Example usage
if __name__ == "__main__":
    # Define a Pydantic model for the desired response format
    class UserInfo(BaseModel):
        name: str
        age: int
        email: str
    
    # Sample text to be processed
    text = """
    John Doe, a 35-year-old software engineer from New York, has been working with large language models for several years.
    His email address is johndoe@example.com.
    """
    
    # Call the function with example inputs
    response = llm_reply(
        prompt=text,
        system_prompt="Your job is to extract user information from the given text.",
        response_format=UserInfo
    )
    
    print(response)
    print(llm_reply('write hello world'))
