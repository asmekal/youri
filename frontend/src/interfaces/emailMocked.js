// -----------------------------
// Mock Gmail API Implementation
// -----------------------------

// Initial Mock Data
let mockEmails = [
    {
        id: '1',
        threadId: 't1',
        labelIds: ['INBOX'],
        snippet: 'Welcome to our service!',
        internalDate: Date.now().toString(),
        payload: {
            mimeType: 'text/plain',
            headers: [
                { name: 'From', value: 'alice@example.com' },
                { name: 'To', value: 'you@example.com' },
                { name: 'Subject', value: 'Welcome!' },
                { name: 'Date', value: 'Sun, 17 Nov 2024 09:30:00 -0800' },
            ],
            body: {
                size: 52,
                data: btoa('Welcome to our service!'), // Base64 encoded
            },
        },
        sizeEstimate: 251,
        raw: btoa(`From: alice@example.com\r\nTo: you@example.com\r\nSubject: Welcome!\r\nDate: Sun, 17 Nov 2024 09:30:00 -0800\r\n\r\nWelcome to our service!`),
        read: false,
    },
    {
        id: '2',
        threadId: 't2',
        labelIds: ['INBOX'],
        snippet: 'Don\'t forget our meeting tomorrow at 10:00 AM.',
        internalDate: (Date.now() - 86400000).toString(), // 1 day ago
        payload: {
            mimeType: 'text/plain',
            headers: [
                { name: 'From', value: 'bob@example.com' },
                { name: 'To', value: 'you@example.com' },
                { name: 'Subject', value: 'Meeting Reminder' },
                { name: 'Date', value: 'Sat, 16 Nov 2024 09:30:00 -0800' },
            ],
            body: {
                size: 65,
                data: btoa('Don\'t forget our meeting tomorrow at 10:00 AM.'),
            },
        },
        sizeEstimate: 300,
        raw: btoa(`From: bob@example.com\r\nTo: you@example.com\r\nSubject: Meeting Reminder\r\nDate: Sat, 16 Nov 2024 09:30:00 -0800\r\n\r\nDon't forget our meeting tomorrow at 10:00 AM.`),
        read: true,
    },
    {
        id: '3',
        threadId: 't3',
        labelIds: ['INBOX'],
        snippet: 'The project is moving along as planned.',
        internalDate: (Date.now() - 2 * 86400000).toString(), // 2 days ago
        payload: {
            mimeType: 'text/plain',
            headers: [
                { name: 'From', value: 'charlie@example.com' },
                { name: 'To', value: 'you@example.com' },
                { name: 'Subject', value: 'Project Update' },
                { name: 'Date', value: 'Fri, 15 Nov 2024 09:30:00 -0800' },
            ],
            body: {
                size: 45,
                data: btoa('The project is moving along as planned.'),
            },
        },
        sizeEstimate: 280,
        raw: btoa(`From: charlie@example.com\r\nTo: you@example.com\r\nSubject: Project Update\r\nDate: Fri, 15 Nov 2024 09:30:00 -0800\r\n\r\nThe project is moving along as planned.`),
        read: false,
    },
];

// Utility function to decode Base64
const decodeBase64 = (data) => {
    return decodeURIComponent(
        atob(data)
            .split('')
            .map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
};

// Mock Gmail API Methods

/**
 * Lists messages similar to Gmail API's users.messages.list
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {number} [params.maxResults] - Maximum number of messages to return
 * @param {string[]} [params.labelIds] - Array of label IDs to filter messages
 * @param {string} [params.q] - Query string for filtering messages
 * @returns {Promise<Object>} - Promise resolving to list of messages
 */
const listMessages = ({ userId, maxResults, labelIds, q }) => {
    return new Promise((resolve) => {
        let filteredEmails = [...mockEmails];

        // Filter by labels
        if (labelIds && labelIds.length > 0) {
            filteredEmails = filteredEmails.filter((email) =>
                labelIds.every((label) => email.labelIds.includes(label))
            );
        }

        // Simple query filtering (e.g., 'is:unread')
        if (q) {
            if (q.includes('is:unread')) {
                filteredEmails = filteredEmails.filter((email) => !email.read);
            }
            // Add more query handling as needed
        }

        // Sort by internalDate descending
        filteredEmails.sort((a, b) => parseInt(b.internalDate) - parseInt(a.internalDate));

        // Apply maxResults
        if (maxResults) {
            filteredEmails = filteredEmails.slice(0, maxResults);
        }

        // Map to message list format
        const messages = filteredEmails.map((email) => ({
            id: email.id,
            threadId: email.threadId,
        }));

        resolve({
            messages,
            resultSizeEstimate: messages.length,
        });
    });
};

/**
 * Gets a single message similar to Gmail API's users.messages.get
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {string} params.id - The ID of the specific email message
 * @param {string} [params.format] - Format of the returned message
 * @returns {Promise<Object>} - Promise resolving to the message details
 */
const getMessage = ({ userId, id, format = 'full' }) => {
    return new Promise((resolve, reject) => {
        const email = mockEmails.find((e) => e.id === id);
        if (!email) {
            reject(new Error('Message not found'));
            return;
        }

        let message = { ...email };

        if (format === 'raw') {
            message = { ...email, raw: email.raw };
        } else if (format === 'metadata') {
            message = {
                id: email.id,
                threadId: email.threadId,
                labelIds: email.labelIds,
                snippet: email.snippet,
                payload: {
                    headers: email.payload.headers,
                },
            };
        } else if (format === 'minimal') {
            message = {
                id: email.id,
                threadId: email.threadId,
                snippet: email.snippet,
            };
        }

        resolve(message);
    });
};

/**
 * Sends an email similar to Gmail API's users.messages.send
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {Object} params.resource - The email resource with raw content
 * @returns {Promise<Object>} - Promise resolving to the sent message
 */
const sendMessage = ({ userId, resource }) => {
    return new Promise((resolve, reject) => {
        try {
            const decodedRaw = atob(resource.raw.replace(/_/g, '/').replace(/-/g, '+'));
            const lines = decodedRaw.split('\r\n');
            const headers = {};
            let body = '';
            let isBody = false;

            lines.forEach((line) => {
                if (line === '') {
                    isBody = true;
                    return;
                }
                if (!isBody) {
                    const [key, ...rest] = line.split(': ');
                    headers[key] = rest.join(': ');
                } else {
                    body += line + '\n';
                }
            });

            const newEmail = {
                id: (mockEmails.length + 1).toString(),
                threadId: `t${mockEmails.length + 1}`,
                labelIds: ['INBOX'],
                snippet: body.substring(0, 100),
                internalDate: Date.now().toString(),
                payload: {
                    mimeType: 'text/plain',
                    headers: [
                        { name: 'From', value: headers['From'] || 'you@example.com' },
                        { name: 'To', value: headers['To'] },
                        { name: 'Subject', value: headers['Subject'] },
                        { name: 'Date', value: new Date().toString() },
                    ],
                    body: {
                        size: body.length,
                        data: btoa(body.trim()),
                    },
                },
                sizeEstimate: body.length + 200,
                raw: resource.raw,
                read: false,
            };

            mockEmails = [newEmail, ...mockEmails];

            resolve(newEmail);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Modifies a message similar to Gmail API's users.messages.modify
 * @param {Object} params
 * @param {string} params.userId - 'me' for authenticated user
 * @param {string} params.id - The ID of the specific email message
 * @param {Object} params.resource - The modifications to apply
 * @returns {Promise<Object>} - Promise resolving to the modified message
 */
const modifyMessage = ({ userId, id, resource }) => {
    return new Promise((resolve, reject) => {
        const emailIndex = mockEmails.findIndex((e) => e.id === id);
        if (emailIndex === -1) {
            reject(new Error('Message not found'));
            return;
        }

        const email = mockEmails[emailIndex];

        // Add labels
        if (resource.addLabelIds) {
            resource.addLabelIds.forEach((label) => {
                if (!email.labelIds.includes(label)) {
                    email.labelIds.push(label);
                }
            });
        }

        // Remove labels
        if (resource.removeLabelIds) {
            email.labelIds = email.labelIds.filter((label) => !resource.removeLabelIds.includes(label));
        }

        // Update read status based on label modifications
        if (resource.removeLabelIds && resource.removeLabelIds.includes('UNREAD')) {
            email.read = true;
        }
        if (resource.addLabelIds && resource.addLabelIds.includes('UNREAD')) {
            email.read = false;
        }

        mockEmails[emailIndex] = email;

        resolve(email);
    });
};

// Export functions
export { listMessages, getMessage, sendMessage, modifyMessage, decodeBase64 };
