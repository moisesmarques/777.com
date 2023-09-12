
export const formatMoney = (number: number) => `${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number*.01)}`;

  export const hex2Buffer = (hex: string) => {
    return new Uint8Array((hex.match(/.{1,2}/g) || [])
    .map(byte => parseInt(byte, 16))).buffer
  }

  export const decryptText = async (encryptedText: string, key: string) => {
    let ivBuffer = hex2Buffer(key.substring(0, 32))
    let keyBuffer = hex2Buffer(key.substring(32))
    let textBuffer = hex2Buffer(encryptedText)
    // Import the derived bits as an AES key
    let aeskey = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-CBC" }, false, ["decrypt"])
    let decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-CBC", iv: ivBuffer }, aeskey, textBuffer);
    return new TextDecoder().decode(decryptedBuffer);
  }
  