export interface IDummy {
  dummy: string;
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
