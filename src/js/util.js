function sanitize (text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s/g, '-');
}

export default {
    sanitize
}