export const useUserUpdate = async (chatId: number | string, secret: string, username: string, email: string) => {
  console.log(username, email);
  try {
    const response = await fetch('http://localhost:8000/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        chatId: String(chatId),
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify({ username, email })
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.message };
    }
    return data;
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
};

export const useUserUpdatePassword = async (
  chatId: number | string,
  secret: string,
  oldPassword: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await fetch('http://localhost:8000/update-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        chatId: String(chatId),
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify({ oldPassword, password, passwordConfirmation, secret })
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message };
    }
    return data;
  } catch (error) {
    console.error(error);
    return { error: String(error) };
  }
};
