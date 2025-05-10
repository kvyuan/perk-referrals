import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  category: string;
  content: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email, category, content
}) => (
  <div>
    <h1>New submission by {email}!</h1>
    <p> Category: {category}</p>
    <p> Content: {content}</p>
  </div>
);