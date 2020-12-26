import { Result } from 'antd';
import React from 'react';
interface RejectedProps {
  message: string;
}

export function Rejected({ message }: RejectedProps): JSX.Element {
  return <Result title={message} status={500}/>;
}