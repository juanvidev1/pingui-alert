export const useUserData = async (chatId: number | string, secret: string) => {
  const sec = secret;
  try {
    const response = await fetch(`http://localhost:8000/user/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        chatId: String(chatId),
        Authorization: `Bearer ${sec}`
      }
    });
    const { user } = await response.json();
    if (!response.ok) {
      return { success: false, message: user.message };
    }
    return { chatId, user, success: true };
  } catch (error) {
    return { error };
  }
};
