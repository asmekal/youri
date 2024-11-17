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
