document.addEventListener('DOMContentLoaded', function () {
  const tg = window.Telegram?.WebApp;
  console.log('integration_members.js loaded');

  const params = new URLSearchParams(window.location.search);
  const ownerChatId = params.get('chatId');
  const membersData = params.get('data');
  const activatePre = params.get('pre') || 'true';
  console.log('Activate pre', activatePre);

  if (tg) {
    tg.ready();
    tg.expand();
    console.log('Init data', tg?.initDataRaw);
    tg.MainButton.show();
    tg.MainButton.setText('Close');
    tg.MainButton.onClick(() => {
      tg.sendData(JSON.stringify({ action: 'close', message: 'No members to revoke' }));
      tg.close();
    });
  }

  const membersContainer = document.getElementById('integration-members');
  console.log('data:', membersData);

  const initDataCont = document.getElementById('initDataCont');
  if (initDataCont) {
    if (activatePre == 'true') {
      initDataCont.textContent = JSON.stringify(tg, null, 2);
      initDataCont.style.display = 'block';
    } else {
      initDataCont.style.display = 'none';
    }
  }

  const membersToRevoke = [];
  if (membersContainer) {
    const payload = JSON.parse(atob(membersData.replace(/-/g, '+').replace(/_/g, '/')));
    console.log('Payload:', payload);

    payload?.members.forEach((member) => {
      const memberElement = document.createElement('div');
      memberElement.className = 'member';
      if (Object.entries(tg?.initDataUnsafe).length > 0) {
        memberElement.dataset.chatId = member.chatId;
        memberElement.dataset.integrationId = member.integrationId;
        memberElement.innerHTML = `
          <div class="member-info card">
            <div class="member-photo">
              <img src="${tg?.initDataUnsafe?.user?.photo_url || 'https://placehold.co/100x100?text=No+Photo'}" alt="Photo">
            </div>
            <div class="member-details">
              <div class="member-name">Chat id: ${member.chatId}</div>
              <div class="member-username">Username: ${tg?.initDataUnsafe?.user?.username}</div>
              <div class="joined-at">Joined at: ${new Date(member.createdAt).toLocaleString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</div>
              <div class="revoke-btn">
                <button class="member-revoke" id="revoke-${member.chatId}">Revoke member</button>
              </div>
            </div>
          </div>
        `;
      } else {
        memberElement.dataset.chatId = member.chatId;
        memberElement.innerHTML = `
          <div class="member-info card">
            <div class="member-name">Chat id: ${member.chatId}</div>
            <div class="joined-at">Joined at: ${new Date(member.createdAt).toLocaleString('es-CO', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</div>
           <div class="revoke-btn">
                <button class="member-revoke" id="revoke-${member.chatId}">Revoke member</button>
              </div>
            </div>
          </div>
        `;
      }
      membersContainer.appendChild(memberElement);
    });
  }

  let integrationId = null;
  const memberCards = document.querySelectorAll('.member');
  if (memberCards && memberCards.length > 0) {
    memberCards.forEach((card) => {
      const chatId = card.dataset.chatId;
      const integrationId = card.dataset.integrationId;
      const revokeBtn = card.querySelector(`#revoke-${chatId}`);
      if (revokeBtn) {
        revokeBtn.addEventListener('click', async () => {
          if (chatId === ownerChatId) {
            Swal.fire({
              title: 'Error',
              text: 'You cannot revoke the integration owner',
              icon: 'error',
              showCancelButton: true,
              cancelButtonText: 'Ok',
              showConfirmButton: false
            });
            return;
          }
          if (membersToRevoke.includes(chatId)) {
            membersToRevoke.splice(membersToRevoke.indexOf(chatId), 1);
            revokeBtn.innerHTML = 'Revoke member';
            if (tg) {
              tg.MainButton.setText(`Close`);
              tg.MainButton.onClick(() => {
                if (membersToRevoke.length === 0) {
                  tg.sendData(JSON.stringify({ action: 'close', message: 'No members to revoke' }));
                  tg.close();
                }
              });
            }
          } else {
            membersToRevoke.push(chatId);
            console.log('Members to revoke:', membersToRevoke);
            console.log('Btn content', revokeBtn.innerHTML);
            revokeBtn.innerHTML = membersToRevoke.includes(chatId) ? 'Member revoked' : 'Revoke member';
            // card.remove();
            if (tg) {
              tg.MainButton.setText(`Selected: ${membersToRevoke.length}`);
              tg.MainButton.onClick(() => {
                console.log('Main button clicked');
                if (membersToRevoke.length === 0) {
                  tg.sendData(JSON.stringify({ action: 'close', message: 'No members to revoke' }));
                  tg.close();
                  return;
                }
                const dataObj = {
                  action: 'revoke',
                  integrationId,
                  chatIds: membersToRevoke.join(',')
                };
                console.log('Sending data back to bot:', dataObj);
                tg.sendData(JSON.stringify(dataObj));
                tg.close();
              });
            }
          }
        });
      }
    });
  }
});
