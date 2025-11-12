import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Upload, Modal, Message, Select, Popover } from '@arco-design/web-react';
import { IconUpload, IconLoading, IconCheck, IconEmoji } from '@arco-design/web-react/icon';
import SimpleWysiwyg from 'react-simple-wysiwyg';

// 常用emoji分类
const emojiCategories = {
  '表情': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
  '手势': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  '物品': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '📔', '📓', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  '符号': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜']
};

interface EmailEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  variableList?: string[];
  onInsertVariable?: (variable: string) => void;
}

const EmailEditor: React.FC<EmailEditorProps> = ({ 
  initialValue = '', 
  value,
  onChange,
  className = '',
  variableList = [],
  onInsertVariable
}) => {
  const [html, setHtml] = useState(initialValue);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editorHeight, setEditorHeight] = useState('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // 同步外部value
  useEffect(() => {
    if (value !== undefined) {
      setHtml(value);
    }
  }, [value]);

  // 自动高度调整
  useEffect(() => {
    const updateEditorHeight = () => {
      if (editorRef.current) {
        const editorElement = editorRef.current.querySelector('.rsw-editor');
        if (editorElement) {
          // 获取内容高度，设置最小高度为300px，最大高度为窗口高度的80%
          const contentHeight = Math.max(300, editorElement.scrollHeight);
          const maxHeight = window.innerHeight * 0.8;
          const finalHeight = Math.min(contentHeight, maxHeight);
          setEditorHeight(`${finalHeight}px`);
        }
      }
    };

    // 初始调整
    updateEditorHeight();

    // 监听内容变化
    const observer = new MutationObserver(updateEditorHeight);
    if (editorRef.current) {
      const editorElement = editorRef.current.querySelector('.rsw-editor');
      if (editorElement) {
        observer.observe(editorElement, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    }

    // 监听窗口大小变化
    const handleResize = () => {
      updateEditorHeight();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [html]);

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 模拟文件上传过程
      setUploading(true);
      setUploadProgress(0);
      
      // 模拟上传进度
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            
            // 模拟上传完成后插入图片或附件链接
            const fileType = files[0].type.split('/')[0];
            if (fileType === 'image') {
              // 插入图片
              const imgTag = `<img src="https://example.com/uploaded-image.jpg" alt="${files[0].name}" style="max-width: 100%; height: auto;" />`;
              const newHtml = html + imgTag;
              setHtml(newHtml);
              onChange?.(newHtml);
            } else {
              // 插入附件链接
              const linkTag = `<p><a href="https://example.com/${files[0].name}" target="_blank">${files[0].name}</a></p>`;
              const newHtml = html + linkTag;
              setHtml(newHtml);
              onChange?.(newHtml);
            }
            
            Message.success('文件上传成功');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">单元格1</td>
          <td style="border: 1px solid #ccc; padding: 8px;">单元格2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">单元格3</td>
          <td style="border: 1px solid #ccc; padding: 8px;">单元格4</td>
        </tr>
      </table>
    `;
    const newHtml = html + tableHtml;
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const insertLink = () => {
    const url = prompt('请输入链接地址:', 'https://');
    if (url) {
      const linkHtml = `<a href="${url}" target="_blank">${url}</a>`;
      const newHtml = html + linkHtml;
      setHtml(newHtml);
      onChange?.(newHtml);
    }
  };

  const insertEmoji = (emoji: string) => {
    const newHtml = html + emoji;
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  const insertVariable = (variable: string) => {
    const variableText = `{${variable}}`;
    const newHtml = html + variableText;
    setHtml(newHtml);
    onChange?.(newHtml);
    onInsertVariable?.(variable);
  };

  // 渲染emoji选择器
  const renderEmojiSelector = () => (
    <Popover
      trigger="click"
      position="bottom"
      content={
        <div style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div key={category} className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">{category}</div>
              <div className="grid grid-cols-8 gap-1">
                {emojis.map(emoji => (
                  <Button
                    key={emoji}
                    type="text"
                    size="mini"
                    className="text-lg p-1 min-w-0 h-8"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    >
      <Button size="small" icon={<IconEmoji />}>
        表情
      </Button>
    </Popover>
  );

  return (
    <div className={`email-editor ${className}`} ref={editorRef}>
      {/* 编辑器工具栏 */}
      <div className="editor-toolbar mb-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200">
        <Space wrap size="small">
          <Button size="small" onClick={insertLink}>插入链接</Button>
          {renderEmojiSelector()}
          <Button size="small" onClick={insertTable}>插入表格</Button>
          {variableList.length > 0 && (
            <Select 
              placeholder="插入变量" 
              size="small"
              style={{ width: 120 }}
              onChange={insertVariable}
            >
              {variableList.map(variable => (
                <Select.Option key={variable} value={variable}>
                  {variable}
                </Select.Option>
              ))}
            </Select>
          )}
          <Button 
            size="small" 
            onClick={handleUploadClick}
            icon={uploading ? <IconLoading /> : <IconUpload />}
          >
            {uploading ? `上传中 ${uploadProgress}%` : '上传附件'}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
        </Space>
      </div>
      
      {/* 富文本编辑器 */}
      <div className="editor-container border border-gray-200 rounded-b-lg" style={{ height: editorHeight }}>
        <SimpleWysiwyg
          value={html}
          onChange={handleChange}
          containerClassName="w-full h-full"
        />
      </div>
      
      {/* 上传进度模态框 */}
      <Modal
        visible={uploading}
        title="文件上传中"
        footer={null}
        closable={false}
      >
        <div className="text-center py-4">
          <IconLoading className="text-3xl animate-spin mx-auto mb-2" />
          <p>正在上传文件，请稍候...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2">{uploadProgress}%</p>
        </div>
      </Modal>
    </div>
  );
};

export default EmailEditor;