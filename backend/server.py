from pprint import pprint

import instructor
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from groq import Groq

# Load the Groq API key from .env file
load_dotenv()