(() => {
  'use strict';
  const counter=document.querySelector('#visitCounter');
  const value=document.querySelector('#visitCount');
  if(!counter||!value)return;
  if(location.protocol==='file:'||location.hostname==='127.0.0.1'||location.hostname==='localhost')return;

  const endpoint=location.hostname.endsWith('github.io')
    ?'https://qingming-riverside.zhangxianxie6.workers.dev/api/visits'
    :'/api/visits';
  const abort=new AbortController();
  const timeout=setTimeout(()=>abort.abort(),3000);

  fetch(endpoint,{method:'POST',headers:{Accept:'application/json'},cache:'no-store',signal:abort.signal})
    .then(response=>{
      if(!response.ok)throw new Error(`Visit counter returned ${response.status}`);
      return response.json();
    })
    .then(data=>{
      if(!Number.isSafeInteger(data.count)||data.count<1)throw new Error('Invalid visit count');
      clearTimeout(timeout);value.textContent=new Intl.NumberFormat('zh-CN').format(data.count);
      counter.dataset.state='ready';
      counter.setAttribute('aria-label',`网站累计访问 ${value.textContent} 次`);
    })
    .catch(error=>{
      clearTimeout(timeout);counter.dataset.state='error';
      console.warn('Visit counter unavailable:',error);
    });
})();
