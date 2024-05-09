import { IconCopy, IconCopyCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export default function useCopyIcon() {
  const [, copy] = useCopyToClipboard();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const id = setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => {
      clearTimeout(id);
    };
  }, [copied]);

  return { copy, copied, setCopied, CopyIcon: copied ? IconCopyCheck : IconCopy };
}
