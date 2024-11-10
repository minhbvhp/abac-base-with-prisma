import { JsonValue } from '@prisma/client/runtime/library';

export const parseCondition = (
	conditions: JsonValue,
	user: any,
): Record<string, any> => {
	const conditionStr = JSON.stringify(conditions);

	// Replace placeholders with actual values from the user object
	const replaced = conditionStr.replace(/\$\{(\w+)\}/g, (_, key) => {
		return user[key];
	});
	return JSON.parse(replaced);
};
