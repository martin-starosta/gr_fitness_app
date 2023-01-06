export const validateEnumValue = (
    value: string,
    enumObject: Record<string, string>,
    parameterName: string
) => {
    if (!Object.values(enumObject).includes(value)) {
        throw new Error(
            `Invalid ${parameterName}. Valid values are: ${Object.values(
                enumObject
            )}`
        );
    }
    return true;
};
