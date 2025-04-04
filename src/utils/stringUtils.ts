/**
 * 统计字符串中包含指定字符集合中的子字符串数量
 * @param str 要检查的长句子
 * @param targetChars 目标字符集合
 * @returns 包含的子字符串数量
 */
export const countSubstrings = (str: string, targetChars: string): number => {
  if (!str || !targetChars) return 0;
  
  // 将目标字符集合转换为正则表达式模式
  const pattern = new RegExp(`[${targetChars}]`, 'g');
  
  // 使用正则表达式匹配所有目标字符
  const matches = str.match(pattern);
  
  // 返回匹配到的字符数量
  return matches ? matches.length : 0;
};

/**
 * Finds the best matching key from reference images based on prompt
 * @param prompt The prompt to match against
 * @param referenceImages The reference images object
 * @returns The best matching key or null if no match found
 */
export const findBestMatch = (prompt: string, referenceImages: Record<string, { url: string }[]>): string | null => {
  if (!prompt || !referenceImages) return null;
  
  let bestMatch = '';
  let maxCount = 0;
  
  Object.keys(referenceImages).forEach(key => {
    const count = countSubstrings(prompt, key);
    if (count > maxCount) {
      maxCount = count;
      bestMatch = key;
    }
  });
  
  return maxCount > 0 ? bestMatch : null;
}; 