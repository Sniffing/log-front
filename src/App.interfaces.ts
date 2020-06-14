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

interface IEntryDTO {
  date: string;
}

export interface IKeywordDTO extends IEntryDTO {
  keywords: string[];
}

export interface IWeightDTO extends IEntryDTO {
  weight: string;
}

export interface ITextDTO extends IEntryDTO {
  text: string;
}
