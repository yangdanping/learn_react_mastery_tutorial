// =====================================
// PATTERN 6: Event Handling & Forms -- useCallback, useMemo, useEffect, useState
// =====================================

/*
🎯 KEY TAKEAWAYS | 关键要点:
• Controlled components keep form state in React (not DOM)
• 受控组件将表单状态保存在 React 中（而非 DOM）
• Always prevent default behavior in form submissions
• 表单提交务必阻止默认行为
• Use onChange to keep state in sync with inputs
• 使用 onChange 让状态与输入保持同步
• Validate inputs and show helpful error messages
• 对输入进行校验并显示友好错误信息
• useCallback prevents unnecessary re-renders in child components
• useCallback 可避免子组件不必要的重渲染
• Avoid inline functions in JSX for better performance
• 尽量避免在 JSX 中写内联函数以提升性能
• Store and display multiple submitted data entries for better user experience
• 存储并展示多条提交记录，提升用户体验
• Side-by-side layout for form and submitted data display
• 表单与提交记录并排布局
• Array state management for multiple data entries
• 使用数组状态管理多条记录
*/

'use client';

import React, { useState, useCallback, useMemo } from 'react';

import { CustomButton } from './03_ButtonShowcase(Props示例)';
import { Title } from './Title';
import { SubmittedFormData } from './types';
import { generateRandomNumber } from '@/utils/getRamdomNum';
type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: `${generateRandomNumber(1000, 9999)}@gmail.com`,
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedDataList, setSubmittedDataList] = useState<SubmittedFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextId, setNextId] = useState(1); // Counter for generating unique IDs

  // ❌ BAD: Inline functions create new functions every render(内联函数每次渲染都会创建新函数)
  // This causes child components to re-render unnecessarily(这会导致子组件发生不必要的重渲染)
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Validation logic here
  //   setSubmitted(true);
  // };

  // In JSX: onChange={(e) => setFormData({...formData, name: e.target.value})}
  // JSX 中的写法如上
  // Creates new function every render = performance issue!(每次渲染都创建新函数 = 性能问题！)
  // ✅ GOOD: useCallback prevents unnecessary re-renders(useCallback 避免不必要的重渲染)
  const handleChange = useCallback(
    (e: ChangeEvent) => {
      const { name, value } = e.target;
      // 根据表单组件设置的name来组装formData
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing(当用户开始输入时清除对应错误)
      errors[name] && setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [errors]
  );

  const isFormValid = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    const hasErrors = Object.keys(newErrors).length;
    hasErrors && setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // 简单校验
      if (!isFormValid()) return;
      // Show loading state during submission(提交期间展示加载状态)
      setIsSubmitting(true);

      return await new Promise((resolve) => {
        // Simulate API call delay(模拟 API 调用延迟)
        setTimeout(() => {
          // Create new submission with unique ID(创建带唯一 ID 的新提交记录)
          const newSubmission: SubmittedFormData = {
            id: nextId,
            ...formData,
            submittedAt: new Date().toLocaleString()
          };
          setSubmittedDataList((prev) => [newSubmission, ...prev]); // 添加到提交记录列表（最新在前）
          setNextId((prev) => prev + 1); // 预生成唯一 ID,给下一次提交使用

          // 清空表单并重置状态
          reset();
        }, 1000);
      });
    },
    [formData, nextId]
  );

  // Delete specific submission by ID 通过 ID 删除指定提交记录
  const handleDeleteSubmission = useCallback((id: number) => {
    setSubmittedDataList((prev) => prev.filter((submission) => submission.id !== id));
  }, []);

  // Delete all submissions 删除所有提交记录
  const handleDeleteAll = useCallback(() => {
    console.log('06_ContactForm(表单处理示例) handleDeleteAll 删除所有提交记录');
    setSubmittedDataList([]);
  }, []);

  // Calculate submission statistics using useMemo for performance
  // 使用 useMemo 计算统计信息以提升性能(仅在submittedDataList发生变化时重新计算)
  const submissionStats = useMemo(() => {
    return {
      total: submittedDataList.length,
      uniqueEmails: new Set(submittedDataList.map((s) => s.email)).size,
      avgMessageLength: submittedDataList.length ? Math.round(submittedDataList.reduce((sum, s) => sum + s.message.length, 0) / submittedDataList.length) : 0
    };
  }, [submittedDataList]);

  const reset = () => {
    setFormData({ name: '', email: `${generateRandomNumber(1000, 9999)}@gmail.com`, message: '' });
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <div className="widget">
      <Title icon="📧" title="Contact Form" patternBadge="Forms" />
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        Controlled components with validation and multiple data persistence
      </p>

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Form */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            📝 Submit Message
          </h4>

          {isSubmitting && (
            <div className="mb-4 p-3 rounded text-center tint tint-primary">
              <div className="status-loading">📤 Sending...</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="input" disabled={isSubmitting} />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="mb-4">
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your email" className="input" disabled={isSubmitting} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message" className="textarea" disabled={isSubmitting} />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>

            <CustomButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </CustomButton>
          </form>
        </div>

        {/* Right side - Submitted Data Display */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              📋 Message History
            </h4>
            {!!submittedDataList.length && (
              <CustomButton
                variant="destructive"
                onClick={handleDeleteAll}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                🗑️ Clear All
              </CustomButton>
            )}
          </div>

          {/* Modern Statistics Cards */}
          {!!submittedDataList.length && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl tint tint-primary">
                <div className="text-2xl font-bold tint-text-primary">
                  {submissionStats.total}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Total Messages
                </div>
              </div>
              <div className="text-center p-3 rounded-xl tint tint-success">
                <div className="text-2xl font-bold tint-text-success">
                  {submissionStats.uniqueEmails}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Unique Senders
                </div>
              </div>
              <div className="text-center p-3 rounded-xl tint tint-warning">
                <div className="text-2xl font-bold tint-text-warning">
                  {submissionStats.avgMessageLength}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  Avg Length
                </div>
              </div>
            </div>
          )}

          {submittedDataList.length ? (
            <div
              className="space-y-4 max-h-96 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--muted-foreground) transparent'
              }}
            >
              {submittedDataList.map((submission, index) => (
                <div
                  key={submission.id}
                  className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'var(--background)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {/* Modern message header with gradient badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: index === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        #{submission.id}
                      </div>
                      {index === 0 && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium tint tint-success tint-text-success">
                          ✨ Latest
                        </div>
                      )}
                    </div>
                    <CustomButton
                      variant="destructive"
                      onClick={() => handleDeleteSubmission(submission.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'color-mix(in srgb, var(--destructive) 14%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--destructive) 28%, transparent)',
                        color: 'var(--destructive)'
                      }}
                    >
                      ✕
                    </CustomButton>
                  </div>

                  {/* Enhanced submission data with better typography */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          👤 SENDER
                        </span>
                      </div>
                      <div
                        className="text-sm font-medium px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {submission.name}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          📧 EMAIL
                        </span>
                      </div>
                      <div
                        className="text-sm font-mono px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)',
                          fontSize: '12px'
                        }}
                      >
                        {submission.email}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          💬 MESSAGE
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full chip">
                          {submission.message.length} chars
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed px-3 py-2 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--foreground)', lineHeight: '1.5' }}>
                        {submission.message}
                      </div>
                    </div>

                    {/* Modern timestamp with icon */}
                    <div
                      className="flex items-center gap-2 pt-3 mt-3"
                      style={{
                        borderTop: '1px solid var(--border)'
                      }}
                    >
                      <span className="text-xs">🕒</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                        {submission.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 rounded-2xl empty-panel">
              {/* Modern empty state */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 tint tint-primary">
                  <span className="text-2xl">📭</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                No Messages Yet
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Submit your first message using the form
                <br />
                to see it beautifully displayed here!
              </p>
              <div className="inline-block mt-4 px-4 py-2 rounded-full text-xs font-medium chip">
                ✨ Ready for your first message
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
