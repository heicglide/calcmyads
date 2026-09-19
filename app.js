const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const number=v=>{const n=Number(String(v).replace(/,/g,'').trim());return Number.isFinite(n)?n:NaN};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
const compact=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
const setResult=(value,note,raw)=>{const valueEl=$('#result-value');const noteEl=$('#result-note');valueEl.textContent=value;noteEl.textContent=note;$('#orbit-value')&&($('#orbit-value').textContent=value);const copy=$('#copy-result');if(copy){copy.disabled=false;copy.dataset.copy=`${value} — ${note}`;}window.currentResult=raw};
const calc={
 cpc:v=>({value:money(v.cost/v.clicks),note:`${money(v.cost)} ÷ ${compact(v.clicks)} clicks`,raw:v.cost/v.clicks}),
 ctr:v=>({value:`${compact(v.clicks/v.impressions*100)}%`,note:`${compact(v.clicks)} clicks ÷ ${compact(v.impressions)} impressions`,raw:v.clicks/v.impressions*100}),
 roas:v=>({value:`${compact(v.revenue/v.cost)}×`,note:`${compact(v.revenue/v.cost*100)}% return on ad spend`,raw:v.revenue/v.cost}),
 roi:v=>({value:`${compact((v.revenue-v.cost)/v.cost*100)}%`,note:`Net return: ${money(v.revenue-v.cost)}`,raw:(v.revenue-v.cost)/v.cost*100}),
 ecpm:v=>({value:money(v.earnings/v.impressions*1000),note:`Earnings per 1,000 impressions`,raw:v.earnings/v.impressions*1000}),
 adcost:v=>({value:money(v.cpm*v.impressions/1000),note:`Estimated cost for ${compact(v.impressions)} impressions`,raw:v.cpm*v.impressions/1000}),
 impressions:v=>({value:compact(v.cost/v.cpm*1000),note:`Estimated impressions at ${money(v.cpm)} CPM`,raw:v.cost/v.cpm*1000})
};
const form=$('[data-calculator]');if(form){const type=form.dataset.calculator;const error=$('.form-error',form);const inputs=$$('input',form);const solve=$('#solve-for',form);
 const sync=()=>{if(type!=='cpm'||!solve)return;inputs.forEach(i=>{const disabled=i.name===solve.value;i.disabled=disabled;if(disabled)i.value='';});};sync();solve&&solve.addEventListener('change',sync);
 form.addEventListener('submit',e=>{e.preventDefault();error.textContent='';const v={};let ok=true;inputs.forEach(i=>{if(i.disabled)return;v[i.name]=number(i.value);if(!Number.isFinite(v[i.name])||v[i.name]<=0)ok=false});if(!ok){error.textContent='Enter positive numbers in every active field.';return}let r;if(type==='cpm'){if(solve.value==='cpm')r={value:money(v.cost/v.impressions*1000),note:`${money(v.cost)} across ${compact(v.impressions)} impressions`,raw:v.cost/v.impressions*1000};if(solve.value==='cost')r={value:money(v.cpm*v.impressions/1000),note:`Estimated campaign cost`,raw:v.cpm*v.impressions/1000};if(solve.value==='impressions')r={value:compact(v.cost/v.cpm*1000),note:`Estimated ad impressions`,raw:v.cost/v.cpm*1000}}else r=calc[type](v);setResult(r.value,r.note,r.raw)});
 form.addEventListener('reset',()=>setTimeout(()=>{sync();$('#result-value').textContent='—';$('#result-note').textContent='Enter your values to calculate.';$('#orbit-value')&&($('#orbit-value').textContent='—');$('#copy-result').disabled=true;error.textContent=''},0));}
$('#copy-result')?.addEventListener('click',async e=>{try{await navigator.clipboard.writeText(e.currentTarget.dataset.copy);e.currentTarget.textContent='Copied';setTimeout(()=>e.currentTarget.textContent='Copy result',1200)}catch{e.currentTarget.textContent='Copy unavailable'}});
const cf=$('#compare-form');if(cf){cf.addEventListener('input',()=>{const f=new FormData(cf),aC=number(f.get('aCost')),aI=number(f.get('aImpressions')),bC=number(f.get('bCost')),bI=number(f.get('bImpressions'));if([aC,aI,bC,bI].some(x=>!Number.isFinite(x)||x<=0))return;const a=aC/aI*1000,b=bC/bI*1000;$('#a-output').textContent=money(a)+' CPM';$('#b-output').textContent=money(b)+' CPM';$('#compare-result').textContent=Math.abs(a-b)<.005?'Both campaigns have the same CPM.':`${a<b?'Campaign A':'Campaign B'} has the lower CPM by ${money(Math.abs(a-b))}.`;});}
const mb=$('.menu-button');mb?.addEventListener('click',()=>{const n=$('#site-nav');const open=n.classList.toggle('open');mb.setAttribute('aria-expanded',String(open))});
