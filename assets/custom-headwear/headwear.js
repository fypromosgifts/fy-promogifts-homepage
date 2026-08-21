(function(){
  const navToggle=document.querySelector('.nav-toggle');
  const nav=document.getElementById('headwearNav');
  if(navToggle&&nav){
    const closeMenu=()=>{nav.classList.remove('open');navToggle.setAttribute('aria-expanded','false')};
    navToggle.addEventListener('click',()=>{
      const open=!nav.classList.contains('open');
      nav.classList.toggle('open',open);
      navToggle.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach((link)=>link.addEventListener('click',closeMenu));
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeMenu()});
  }

  const filterButtons=document.querySelectorAll('[data-filter]');
  const cards=document.querySelectorAll('[data-category]');
  const resultCount=document.getElementById('resultCount');
  function applyFilter(value){
    let visible=0;
    cards.forEach((card)=>{
      const show=value==='all'||card.dataset.category===value;
      card.hidden=!show;
      if(show)visible+=1;
    });
    filterButtons.forEach((button)=>button.classList.toggle('active',button.dataset.filter===value));
    if(resultCount)resultCount.textContent=`${visible} styles shown`;
  }
  filterButtons.forEach((button)=>button.addEventListener('click',()=>applyFilter(button.dataset.filter)));

  const params=new URLSearchParams(location.search);
  const requestedCategory=params.get('category');
  if(filterButtons.length){
    const valid=[...filterButtons].some((button)=>button.dataset.filter===requestedCategory);
    applyFilter(valid?requestedCategory:'all');
  }
  const requestedProduct=params.get('product');
  if(requestedProduct){
    const productField=document.querySelector('[name="product"]');
    const messageField=document.querySelector('[name="message"]');
    if(productField)productField.value=requestedProduct;
    if(messageField&&!messageField.value)messageField.value=`Please quote ${requestedProduct}.`;
  }

  document.querySelectorAll('[data-quote-product]').forEach((link)=>{
    link.addEventListener('click',()=>{
      const value=link.dataset.quoteProduct;
      const productField=document.querySelector('[name="product"]');
      if(productField)productField.value=value;
    });
  });

  const form=document.querySelector('.headwear-quote-form');
  const status=document.querySelector('.form-status');
  if(form){
    const dateField=form.querySelector('[name="need_by_date"]');
    if(dateField){
      const now=new Date();
      now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
      dateField.min=now.toISOString().slice(0,10);
    }
    form.addEventListener('submit',async(event)=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const button=form.querySelector('[type="submit"]');
      const label=button.textContent;
      button.disabled=true;
      button.textContent='Sending...';
      if(status)status.textContent='';
      try{
        const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
        if(!response.ok)throw new Error('Submission failed');
        form.reset();
        if(status)status.textContent='Thanks — your cap project brief has been sent. We will reply as soon as possible.';
      }catch(error){
        if(status)status.textContent='The form could not be sent. Please email info@fypromogifts.com or contact us on WhatsApp.';
      }finally{
        button.disabled=false;
        button.textContent=label;
      }
    });
  }
})();
