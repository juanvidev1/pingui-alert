document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(globalThis.location.search);
  const chatId = params.get('chatId');

  const loginData = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ chatId, password })
  });

  const data = await loginData.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  const secret = data.secret;
  sessionStorage.setItem('secret', secret);

  globalThis.location.href = `/user-data/${chatId}`;
});
