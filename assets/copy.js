    const button = document.getElementById('copy');
    const prompt = document.getElementById('prompt');
    const status = document.getElementById('status');
    let resetTimer;
    function fallbackCopy(text) {
      const input = document.createElement('textarea');
      input.value = text;
      input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      input.setAttribute('readonly', '');
      document.body.appendChild(input);
      let copied = false;
      try {
        input.focus();
        input.select();
        input.setSelectionRange(0, text.length);
        copied = document.execCommand('copy');
      } finally { input.remove(); button.focus(); }
      if (!copied) throw new Error('Copy unavailable');
    }
    button.addEventListener('click', async () => {
      clearTimeout(resetTimer);
      button.disabled = true;
      try {
        const text = prompt.textContent;
        try {
          if (!navigator.clipboard || !window.isSecureContext) throw new Error('Use fallback');
          await navigator.clipboard.writeText(text);
        } catch { fallbackCopy(text); }
        button.textContent = 'کپی شد ✓';
        status.textContent = 'متن کامل کپی شد؛ می‌توانید آن را جای‌گذاری کنید.';
        resetTimer = setTimeout(() => { button.textContent = 'کپی پرامپت'; }, 2500);
      } catch {
        button.textContent = 'کپی پرامپت';
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(prompt);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'کپی خودکار انجام نشد. متن انتخاب شده را با گزینه «کپی» دستگاه کپی کنید.';
      } finally { button.disabled = false; }
    });
