import json
import os
from functools import wraps
from typing import Any, Callable
from pydantic import BaseModel

# Define a simple function to create a unique cache file name for each decorated function
def _get_cache_filename(func_name: str) -> str:
    if not os.path.exists('./cache'):
        os.makedirs('./cache', exist_ok=True)
    return f"./cache/{func_name}_cache.json"

def local_cache(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        # Extract the function name and cache file path
        func_name = func.__name__
        cache_file = _get_cache_filename(func_name)

        # Check if 'response_format' is passed and is a subclass of BaseModel
        response_format = kwargs.get('response_format')
        is_pydantic_model = isinstance(response_format, type) and issubclass(response_format, BaseModel)

        # Load existing cache if present
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                cache = json.load(f)
        else:
            cache = {}

        # Create a cache key based on function arguments
        cache_key = json.dumps({'args': args, 'kwargs': {k: v for k, v in kwargs.items() if k != 'response_format'}})

        # Check if result is already in cache
        if cache_key in cache:
            result = cache[cache_key]
            # Transform cached JSON back into the Pydantic model if required
            if is_pydantic_model:
                result = response_format.parse_obj(result)
            return result

        # Call the original function and get the result
        result = func(*args, **kwargs)

        # Convert result to a JSON-serializable format if necessary
        if is_pydantic_model and isinstance(result, BaseModel):
            result_dict = result.dict()
            cache[cache_key] = result_dict
        else:
            cache[cache_key] = result

        # Save the updated cache to the JSON file
        with open(cache_file, 'w') as f:
            json.dump(cache, f)

        # Return the result, converting to the response format if needed
        return result if not is_pydantic_model else response_format.parse_obj(result)

    return wrapper

# # Example Pydantic model for testing
# class ExampleResponse(BaseModel):
#     message: str
#     value: int

# # Example function using the decorator
# @local_cache
# def my_function(a, b, response_format=None):
#     return ExampleResponse(message="Hello", value=a + b) if response_format else {"message": "Hello", "value": a + b}

# # Example usage
# print(my_function(1, 2, response_format=ExampleResponse))
# print(my_function(3, 4))  # Without using response_format
