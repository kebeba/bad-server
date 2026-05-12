export const normalizeLimitValue = (value: unknown, backupVal: number) => {
    const valueNumeric = Number(value)
    
    if (valueNumeric < 1 || !Number.isFinite(valueNumeric)) {
        return backupVal
    }

    return Math.min(valueNumeric, 10)
}

export const normalizePageValue = (value: unknown, backupVal: number) => {
    const valueNumeric = Number(value)
    
    if (valueNumeric < 1 || !Number.isFinite(valueNumeric)) {
        return backupVal
    }

    return Math.max(valueNumeric, 1)
}
