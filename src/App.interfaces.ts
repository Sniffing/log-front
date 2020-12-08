import { FormItemProps } from 'antd/lib/form';

export type IFormItemError = Pick<FormItemProps, 'validateStatus' | 'help'>