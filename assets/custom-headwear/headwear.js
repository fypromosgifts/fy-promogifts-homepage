(function(){
  function clean(value){
    return String(value||'').replace(/\s+/g,' ').trim().slice(0,160);
  }

  function sectionName(element){
    const section=element&&element.closest('section,header,footer,main');
    if(!section)return 'page';
    return clean(section.id||section.getAttribute('aria-label')||section.className||'page');
  }

  function currentSku(){
    const productField=document.querySelector('[name="product"]');
    const match=(productField&&productField.value||'').match(/\bGF\d{3}\b/);
    return match?match[0]:'not_available';
  }

  function track(name,params){
    const payload=Object.assign({
      page_path:location.pathname,
      page_title:document.title,
      product_area:'custom_headwear'
    },params||{});
    if(typeof window.fyTrackEvent==='function'){
      window.fyTrackEvent(name,payload);
      return;
    }
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(Object.assign({event:name},payload));
  }

  track('headwear_page_view',{sku:currentSku()});

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
  filterButtons.forEach((button)=>button.addEventListener('click',()=>{
    applyFilter(button.dataset.filter);
    track('headwear_filter_select',{filter_name:button.dataset.filter,filter_label:clean(button.textContent)});
  }));

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
      track('headwear_product_select',{product_name:clean(value),destination_url:link.getAttribute('href')||'#quote'});
    });
  });

  document.addEventListener('click',(event)=>{
    const target=event.target.closest&&event.target.closest('a,button');
    if(!target)return;
    const href=target.getAttribute('href')||'';
    const text=clean(target.textContent||target.getAttribute('aria-label')||target.id);
    const card=target.closest('.product-card');
    const cardSku=card&&card.querySelector('.sku');
    if(card&&!target.hasAttribute('data-quote-product')){
      track('headwear_product_select',{
        sku:clean(cardSku&&cardSku.textContent)||'not_available',
        product_name:clean(card.querySelector('h3')&&card.querySelector('h3').textContent),
        destination_url:href||'not_available'
      });
    }
    if(href.indexOf('wa.me/')>-1){
      track('headwear_whatsapp_click',{link_text:text,cta_target:href,source_section:sectionName(target),sku:currentSku()});
      return;
    }
    if(target.matches('.btn')||href==='#quote'||href.endsWith('#quote')){
      track('headwear_cta_click',{cta_text:text,cta_target:href||'button',source_section:sectionName(target),sku:currentSku()});
    }
  },true);

  const form=document.querySelector('.headwear-quote-form');
  const status=document.querySelector('.form-status');
  if(form){
    let formStarted=false;
    form.addEventListener('input',()=>{
      if(formStarted)return;
      formStarted=true;
      track('headwear_form_start',{form_id:form.id||'headwearQuoteForm',sku:currentSku()});
    },true);
    const dateField=form.querySelector('[name="need_by_date"]');
    if(dateField){
      const now=new Date();
      now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
      dateField.min=now.toISOString().slice(0,10);
    }
    form.addEventListener('submit',async(event)=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      track('headwear_form_submit_attempt',{form_id:form.id||'headwearQuoteForm',sku:currentSku()});
      const button=form.querySelector('[type="submit"]');
      const label=button.textContent;
      button.disabled=true;
      button.textContent='Sending...';
      if(status)status.textContent='';
      try{
        const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
        if(!response.ok)throw new Error('Submission failed');
        track('headwear_form_submit_success',{form_id:form.id||'headwearQuoteForm',sku:currentSku(),lead_type:'custom_headwear'});
        track('generate_lead',{form_id:form.id||'headwearQuoteForm',sku:currentSku(),lead_type:'custom_headwear'});
        form.reset();
        if(status)status.textContent='Thanks — your cap project brief has been sent. We will reply as soon as possible.';
      }catch(error){
        track('headwear_form_error',{form_id:form.id||'headwearQuoteForm',sku:currentSku()});
        if(status)status.textContent='The form could not be sent. Please email info@fypromogifts.com or contact us on WhatsApp.';
      }finally{
        button.disabled=false;
        button.textContent=label;
      }
    });
  }
})();
