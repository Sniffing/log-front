export interface IDummy {
  dummy: string;
}

export interface IFormProps {
  id?: string;
  name: string;
  label?: string | React.Component | JSX.Element;
  placeholder?: string;
  validator?: any;
  required?: boolean;
}