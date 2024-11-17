import React, { useState } from 'react';

const CipherTool = () => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [cipherType, setCipherType] = useState('Caesar');
  const [result, setResult] = useState('');

  const handleEncrypt = () => {
    let encryptedText = '';
    if (cipherType === 'Caesar') {
      encryptedText = caesarEncrypt(plaintext, 3);
    } else if (cipherType === 'Vigenere') {
      encryptedText = vigenereEncrypt(plaintext, 'key');
    }
    setResult(encryptedText);
  };

  const handleDecrypt = () => {
    let decryptedText = '';
    if (cipherType === 'Caesar') {
      decryptedText = caesarDecrypt(ciphertext, 3);
    } else if (cipherType === 'Vigenere') {
      decryptedText = vigenereDecrypt(ciphertext, 'key');
    }
    setResult(decryptedText);
  };

  const caesarEncrypt = (text, shift) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        result += String.fromCharCode((charCode - 65 + shift) % 26 + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        result += String.fromCharCode((charCode - 97 + shift) % 26 + 97);
      } else {
        result += text[i];
      }
    }
    return result;
  };

  const caesarDecrypt = (text, shift) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        result += String.fromCharCode((charCode - 65 - shift + 26) % 26 + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        result += String.fromCharCode((charCode - 97 - shift + 26) % 26 + 97);
      } else {
        result += text[i];
      }
    }
    return result;
  };

  const vigenereEncrypt = (text, key) => {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      let keyCode = key.charCodeAt(keyIndex % key.length);
      if (charCode >= 65 && charCode <= 90) {
        result += String.fromCharCode((charCode - 65 + keyCode - 65) % 26 + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        result += String.fromCharCode((charCode - 97 + keyCode - 97) % 26 + 97);
      } else {
        result += text[i];
      }
      keyIndex++;
    }
    return result;
  };

  const vigenereDecrypt = (text, key) => {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      let keyCode = key.charCodeAt(keyIndex % key.length);
      if (charCode >= 65 && charCode <= 90) {
        result += String.fromCharCode((charCode - 65 - keyCode + 65 + 26) % 26 + 65);
      } else if (charCode >= 97 && charCode <= 122) {
        result += String.fromCharCode((charCode - 97 - keyCode + 97 + 26) % 26 + 97);
      } else {
        result += text[i];
      }
      keyIndex++;
    }
    return result;
  };

  return (
    <div>
      <h2>Simple Cipher Tool</h2>
      <select value={cipherType} onChange={(e) => setCipherType(e.target.value)}>
        <option value="Caesar">Caesar</option>
        <option value="Vigenere">Vigenere</option>
      </select>
      <input
        type="text"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        placeholder="Plaintext"
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <input
        type="text"
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        placeholder="Ciphertext"
      />
      <button onClick={handleDecrypt}>Decrypt</button>
      <textarea value={result} readOnly={true} />
    </div>
  );
};

export default CipherTool;