from typing import Optional
import os
from dotenv import load_dotenv
from openai import OpenAI, OpenAIError

# Load environment variables
load_dotenv()

# Initialize OpenAI client with the correct API key
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise OpenAIError("OPENAI_API_KEY environment variable not set.")

client = OpenAI(
    api_key=api_key,
)

prompt_base = """
You are an expert React JS engineer.
You can implement and update React components satisfying any needs of the user.

You must only use Material UI for visual components.
The components you implement must be adaptive and work well both on narrow mobile screens and on laptop in fullscreen.

You have additional internal APIs available that can be used if needed:

Storage API (quite self descriptive):
```
export const createData = async (collectionName, data) => { };
export const readData = async (collectionName) => { };
export const updateData = async (collectionName, id, data) => { };
export const deleteData = async (collectionName, id) => { };
```

Email API (Similar to Gmail API):
```
/**
 * Lists messages similar to Gmail API's users.messages.list
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {number} [params.maxResults] - Maximum number of messages to return
 * @param {string[]} [params.labelIds] - Array of label IDs to filter messages
 * @param {string} [params.q] - Query string for filtering messages
 * @returns {Promise<Object>} - Promise resolving to list of messages
 */
const listMessages = ({ userId, maxResults, labelIds, q }) => { };

/**
 * Gets a single message similar to Gmail API's users.messages.get
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {string} params.id - The ID of the specific email message
 * @param {string} [params.format] - Format of the returned message
 * @returns {Promise<Object>} - Promise resolving to the message details
 */
const getMessage = ({ userId, id, format = 'full' }) => { };

/**
 * Sends an email similar to Gmail API's users.messages.send
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {Object} params.resource - The email resource with raw content
 * @returns {Promise<Object>} - Promise resolving to the sent message
 */
const sendMessage = ({ userId, resource }) => { };

/**
 * Modifies a message similar to Gmail API's users.messages.modify
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {string} params.id - The ID of the specific email message
 * @param {Object} params.resource - The modifications to apply
 * @returns {Promise<Object>} - Promise resolving to the modified message
 */
const modifyMessage = ({ userId, id, resource }) => { };

// Export functions
export { listMessages, getMessage, sendMessage, modifyMessage, decodeBase64 };
```

Here's what user request is:
```
[USER_INTENT]
```

You must only return the code of the component with very few comments and without any imports.
"""

prompt_part_component_exists = """

User is currently lookin at the following component:

```
[EXISTING_COMPONENT_CODE]
```

You should update to satisfy users request.
You shouldn't use any APIs other than internal.
You shouldn't update the internal APIs or the way they are used.
The updated component should visually stay the same with the only exception being user requested changes.
"""

client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY'),
)

def make_ui_component(intent: str, context: dict, component_code: Optional[str]) -> str:
    prompt = prompt_base.replace("[USER_INTENT]", intent)
    if component_code:
        prompt += prompt_part_component_exists.replace("[EXISTING_COMPONENT_CODE]", component_code)
    chat_completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
    )
    return chat_completion.choices[0].message.content
