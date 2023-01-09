export const validateDataExists = async (
    id: number,
    model: any
): Promise<boolean> => {
    const data = await model.findByPk(id);
    if (!data) {
        throw new Error("Invalid ID. Value does not exist");
    }
    return true;
};

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
