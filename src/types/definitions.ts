export type CustomResponseType = {
	message: string;
	result: any;
};

export enum ROLES {
	ADMIN = 'Admin',
	SALES_MANAGER = 'Sales Manager',
	SALES = 'Sales',
	DOCUMENT = 'Document',
	OPERATION = 'Operation',
	ACCOUNTANT = 'Accountant',
}

export const UNIQUE_VIOLATION_CODE = 'P2002';
