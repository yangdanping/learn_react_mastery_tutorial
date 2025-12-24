// 通用标题组件
export interface TitleProps {
  icon: string;
  title: string;
  patternBadge: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'Sean';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

// 04_UserProfile(条件渲染示例)
export interface User {
  name: string;
  email: string;
}

// 05_TodoList(列表渲染示例)
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 06_ContactForm(表单处理示例)
// Type definition for submitted form data
export interface SubmittedFormData {
  id: number; // Unique identifier for each submission
  // 每次提交的唯一标识符
  name: string;
  email: string;
  message: string;
  submittedAt: string; // Timestamp when form was submitted
  // 表单提交时的时间戳
}
