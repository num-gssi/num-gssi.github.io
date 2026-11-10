/* Cache archive downloads used by the homepage. */
(function(){var cache={};window.gssiArchiveHTML=function(path){var key=new URL(path,location.href).href;if(!cache[key])cache[key]=fetch(key).then(function(response){if(!response.ok)throw Error('Archive unavailable');return response.text();});return cache[key];};})();

/* Progressive enhancement: all content and navigation remain usable without JS. */
(function () {
  'use strict';
  var main = document.getElementById('main-content');
  if (!main) return;
  if (main.querySelector('h1#people, h1#faculty')) {
    Array.from(main.querySelectorAll('h3')).forEach(function(heading){
      var section=document.createElement('section');section.className='people-entry';
      heading.before(section);section.append(heading);
      var next=section.nextSibling;
      while(next && !(next.nodeType===1 && /^H[123]$/.test(next.tagName))){var following=next.nextSibling;section.append(next);next=following;}
    });
    main.querySelectorAll('.people-entry .people_photo').forEach(function(img){
      function fallback(){
        if(!img.isConnected)return;
        var name=img.closest('.people-entry').querySelector('h3').textContent.trim();
        var placeholder=document.createElement('span');placeholder.className='people_photo portrait-fallback';
        placeholder.textContent=name.split(/\s+/).filter(Boolean).map(function(part){return part[0];}).slice(0,2).join('');
        placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label','Portrait unavailable: '+name);img.replaceWith(placeholder);
      }
      img.addEventListener('error',fallback,{once:true});
      if(img.complete && img.naturalWidth===0)fallback();
    });
  }
  var heading = main.querySelector('h1');
  var isArchive = heading && /NOMADS Seminars|COMPiLE Reading Group/.test(heading.textContent);
  if (isArchive) {
    main.classList.add('seminar-archive');
    var years = Array.from(main.querySelectorAll('h3[id]')).filter(function (h) { return /Academic Year/.test(h.textContent); });
    if (years.length) {
      var nav = document.createElement('nav');
      nav.className = 'archive-years';
      nav.setAttribute('aria-label', 'Browse by academic year');
      years.forEach(function (h) {
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.replace('Academic Year ', '');
        nav.appendChild(a);
      });
      years[0].before(nav);
    }
    main.querySelectorAll('table').forEach(function (table) {
      var first = table.querySelector('thead');
      if (!first || !/Presenter|Speaker/.test(first.textContent)) return;
      table.classList.add('event-table');
      table.querySelectorAll('tbody tr').forEach(function (row) {
        var cell = row.cells[2];
        if (!cell) return;
        var title = cell.querySelector('strong');
        if (!title) return;
        var nodes = Array.from(cell.childNodes);
        var index = nodes.indexOf(title);
        if (index < 0) return;
        var remainder = nodes.slice(index + 1);
        if (!remainder.some(function (n) { return n.textContent.trim() || n.nodeName === 'A'; })) return;
        var details = document.createElement('details');
        details.className = 'abstract-details';
        var summary = document.createElement('summary');
        summary.textContent = 'Abstract & materials';
        var body = document.createElement('div');
        body.className = 'abstract-body';
        remainder.forEach(function (node) { body.appendChild(node); });
        while (title.nextSibling) title.nextSibling.remove();
        details.append(summary, body);
        cell.appendChild(details);
      });
    });
  }
  main.querySelectorAll('table:not(.event-table)').forEach(function (table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.before(wrapper);
    wrapper.appendChild(table);
  });
  main.querySelectorAll('img').forEach(function (img) {
    if (!img.closest('.gran-sasso-banner')) { img.loading = 'lazy'; img.decoding = 'async'; }
    if (!img.hasAttribute('alt')) img.alt = '';
  });
  document.querySelectorAll('iframe').forEach(function (frame) {
    if (!frame.title) frame.title = /calendar/.test(frame.src) ? 'GSSI group calendar' : 'Map of the GSSI venue';
    frame.loading = 'lazy';
  });
  var searchForm = document.querySelector('#mkdocs_search_modal form');
  if (searchForm) searchForm.addEventListener('submit', function (event) { event.preventDefault(); });
  var searchInput = document.getElementById('mkdocs-search-query');
  if (searchInput) searchInput.addEventListener('input', function () {
    if (typeof window.doSearch === 'function' && typeof window.min_search_length === 'number') window.doSearch();
  });
})();
/* Content stays in the original Markdown pages. No separate seminar database. */
(function () {
  'use strict';
  var list = document.getElementById('upcoming-list');
  if (!list) return;
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var today = {};
  new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(function(p){today[p.type]=p.value;});
  var todayKey = Number(today.year + today.month + today.day);
  function lines(cell) {
    var clone = cell.cloneNode(true);
    clone.querySelectorAll('br').forEach(function(br){br.replaceWith('\n');});
    return clone.textContent.split('\n').map(function(s){return s.trim();}).filter(Boolean);
  }
  function readPage(path, series) {
    return window.gssiArchiveHTML(path).then(function(html){
      var doc = new DOMParser().parseFromString(html,'text/html');
      var events = [];
      doc.querySelectorAll('table').forEach(function(table){
        if (!table.tHead || !/Presenter|Speaker/.test(table.tHead.textContent)) return;
        table.querySelectorAll('tbody tr').forEach(function(row){
          if(row.cells.length<4) return;
          var title = row.cells[2].querySelector('strong');
          if(!title) return;
          var dateText = lines(row.cells[3]).join(' · ');
          var match = dateText.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,\s*(\d{4})/);
          if(!match) return;
          var month = monthNames.indexOf(match[1]), day = Number(match[2]), year = Number(match[4]);
          var key = year*10000+(month+1)*100+day;
          var endKey=year*10000+(month+1)*100+Number(match[3]||day);
          if(endKey<todayKey) return;
          var presenter = lines(row.cells[1]);
          var anchor = row.cells[2].querySelector('[id]');
          var previous = table.previousElementSibling;
          while(!anchor && previous){if(previous.matches('h3[id]')){anchor=previous;break;}previous=previous.previousElementSibling;}
          var time = dateText.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i);
          var venue = row.cells[3].querySelector('a');
          events.push({series:series,title:title.textContent.trim(),speaker:presenter[0]||'',affiliation:presenter.slice(1).join(' · '),date:day+(match[3]?'–'+match[3]:'')+' '+match[1].slice(0,3)+' '+year,iso:year+'-'+String(month+1).padStart(2,'0')+'-'+String(day).padStart(2,'0'),key:key,time:time?time[0]:'',venue:venue?venue.textContent.trim():'',tentative:/date to be confirmed|tentative/i.test(dateText),url:path+(anchor?'#'+anchor.id:'')});
        });
      });
      return events;
    });
  }
  function element(tag, className, text){var el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el;}
  function render(event){
    var card=element('article','seminar-card');
    var badges=element('div','seminar-badges');badges.append(element('span','series-label',event.series));
    if(event.tentative)badges.append(element('span','tentative-label','Date to be confirmed'));
    var date=element('p','seminar-date'),time=element('time','',event.date);time.dateTime=event.iso;date.append(time);
    var title=element('h3',''),link=element('a','',event.title);link.href=event.url;title.append(link);
    card.append(badges,date,title,element('p','seminar-speaker',event.speaker),element('p','',event.affiliation),element('p','seminar-venue',[event.time?event.time+' · Rome time':'',event.venue].filter(Boolean).join(' · ')||'Time and venue to be announced'));
    var details=element('a','','Seminar details →');details.href=event.url;card.append(details);return card;
  }
  Promise.allSettled([readPage('seminar/','NOMADS'),readPage('reading_group/','COMPiLE')]).then(function(results){
    var events=[];var failed=false;
    results.forEach(function(result){if(result.status==='fulfilled')events=events.concat(result.value);else failed=true;});
    list.replaceChildren();
    events.sort(function(a,b){return a.key-b.key;}).slice(0,3).forEach(function(event){list.append(render(event));});
    if(!events.length){var message=element('p','upcoming-status',failed?'Upcoming dates are available in the seminar pages and calendar.':'New talks are on the way. Dates will be announced here.');list.append(message);}
    if(failed && events.length)list.append(element('p','upcoming-status','Check both seminar pages for the full programme.'));
  });
})();


/* Background motion is optional and independent of seminar content. */
(function(){
  'use strict';
  var button=document.querySelector('.landscape-toggle');if(!button)return;
  var paused=false;
  try{paused=localStorage.getItem('gssi-background-paused')==='true';}catch(_){}
  function update(){document.documentElement.classList.toggle('landscape-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume background':'Pause background';}
  update();
  button.addEventListener('click',function(){paused=!paused;update();try{localStorage.setItem('gssi-background-paused',String(paused));}catch(_){}});
})();

/* Compact presentation built from the existing Markdown headings and tables. */
(function () {
  'use strict';
  var main=document.getElementById('main-content');if(!main)return;
  function make(tag,cls,text){var el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;}
  if(main.querySelector('h1#people')){
    document.body.classList.add('people-page');
    var sidebar=main.parentElement.querySelector('.col-md-3');if(sidebar)sidebar.classList.add('people-sidebar');
    main.classList.remove('col-md-9');main.classList.add('col-md-12');
    var nav=make('nav','people-sections');nav.setAttribute('aria-label','Browse people by role');
    var headings=Array.from(main.querySelectorAll(':scope > h2'));
    headings.forEach(function(h){var link=make('a','',h.textContent);link.href='#'+h.id;nav.append(link);});
    if(headings.length)headings[0].before(nav);
    main.querySelectorAll('.people-entry').forEach(function(entry){
      var title=entry.querySelector('h3'),image=entry.querySelector('.people_photo');
      var role=Array.from(entry.querySelectorAll(':scope > p')).find(function(p){return p.children.length===1 && p.firstElementChild.tagName==='EM';});
      var header=make('div','person-header'),portrait=make('div','person-portrait'),identity=make('div','person-identity');
      if(image){var oldParent=image.parentElement;portrait.append(image);if(oldParent!==entry && !oldParent.textContent.trim() && !oldParent.children.length)oldParent.remove();}
      identity.append(title);if(role){role.classList.add('person-role');identity.append(role);}header.append(portrait,identity);entry.prepend(header);
      var links=[];
      Array.from(entry.querySelectorAll(':scope > p')).forEach(function(p){
        var remainder=p.textContent.replace(/Personal webpage|GSSI profile|[·\s]/g,'');
        if(p.querySelector('a') && !remainder){p.classList.add('person-links');links.push(p);}
      });
      var paragraphs=Array.from(entry.querySelectorAll(':scope > p')).filter(function(p){return !links.includes(p) && p.textContent.trim();});
      var words=paragraphs.map(function(p){return p.textContent;}).join(' ').trim().split(/\s+/).length;
      if(words>30){
        var details=make('details','person-biography');details.append(make('summary','','Research & background'));
        paragraphs.forEach(function(p){details.append(p);});entry.append(details);
      }else{paragraphs.forEach(function(p){p.classList.add('person-short-note');});}
      links.forEach(function(p){entry.append(p);});
    });
    headings.forEach(function(h){
      var grid=make('div','people-grid'),next=h.nextElementSibling;
      while(next && next.tagName!=='H2'){
        var following=next.nextElementSibling;
        if(next.classList.contains('people-entry'))grid.append(next);
        next=following;
      }
      if(grid.children.length)h.after(grid);
    });
  }
  var organizerTable=Array.from(main.querySelectorAll('table')).find(function(table){return table.tHead && /Organizer/.test(table.tHead.textContent);});
  if(organizerTable){
    var section=make('section','organizers-section');section.setAttribute('aria-labelledby','organizers-heading');
    var heading=make('h2','','Organizers');heading.id='organizers-heading';section.append(heading);
    var current=make('div','organizer-grid'),previous=make('div','organizer-grid previous-organizers');
    organizerTable.querySelectorAll('tbody tr').forEach(function(row){
      if(row.cells.length<4)return;
      var name=row.cells[1].querySelector('a'),photo=row.cells[0].querySelector('img'),period=row.cells[3].textContent.trim();
      if(!name)return;
      var active=/\bPresent\b/i.test(period),card=make('article','organizer-card'),identity=make('div','organizer-identity');
      var copy=row.cells[1].cloneNode(true);copy.querySelectorAll('a').forEach(function(a){a.remove();});
      var affiliation=copy.textContent.replace(/^\s*,\s*/,'').trim();
      var title=make('h3','');title.append(name);identity.append(title);
      if(affiliation)identity.append(make('p','organizer-affiliation',affiliation));
      identity.append(make('p','organizer-period',period));
      if(photo){photo.removeAttribute('style');photo.alt=name.textContent.trim();photo.loading='lazy';card.append(photo);}
      card.append(identity);(active?current:previous).append(card);
    });
    if(current.children.length)section.append(current);
    if(previous.children.length){var history=make('details','organizer-history');history.append(make('summary','','Previous organizers ('+previous.children.length+')'),previous);section.append(history);}
    var wrapper=organizerTable.closest('.table-responsive');(wrapper||organizerTable).replaceWith(section);
  }
})();

/* A single, page-level programme selector. Content stays in the Markdown archives. */
(function(){
  'use strict';
  var main=document.querySelector('.seminar-archive');if(!main)return;
  if(/\/seminar\/?$/.test(location.pathname) && location.hash==='#tommaso-vanzan-2026'){
    var destination=new URL('../reading_group/',location.href);destination.searchParams.set('year','2026-27');destination.hash='tommaso-vanzan-2026';location.replace(destination.href);return;
  }
  var headings=Array.from(main.querySelectorAll(':scope > h3[id]')).filter(function(h){return /Academic Year/.test(h.textContent);});
  if(!headings.length)return;
  var oldNav=main.querySelector('.archive-years');if(oldNav)oldNav.remove();
  var groups=headings.map(function(heading,index){
    var label=heading.textContent.replace(/Academic Year\s*/,'').trim();
    var section=document.createElement('section');section.className='academic-year-section';section.id='archive-'+heading.id;section.setAttribute('aria-labelledby',heading.id);heading.before(section);
    var node=heading,stop=headings[index+1];while(node && node!==stop){var next=node.nextSibling;section.append(node);node=next;}
    heading.classList.add('archive-year-anchor');
    return {key:label.replace('/','-'),label:label,section:section,heading:heading,count:section.querySelectorAll('.event-table tbody tr').length};
  });
  var header=document.createElement('div');header.className='programme-header';
  var identity=document.createElement('div');identity.className='programme-identity';
  var title=document.createElement('h2');title.textContent='Programme';
  var status=document.createElement('p');status.className='programme-count';status.setAttribute('role','status');status.setAttribute('aria-live','polite');identity.append(title,status);
  var field=document.createElement('div');field.className='programme-year';
  var label=document.createElement('label');label.htmlFor='programme-year';label.textContent='Academic year';
  var select=document.createElement('select');select.id='programme-year';select.name='year';
  groups.forEach(function(group){select.add(new Option(group.label,group.key));});
  field.append(label,select);header.append(identity,field);groups[0].section.before(header);
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function selection(){
    var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){id='';}
    var target=id?document.getElementById(id):null;
    var byHash=target && groups.find(function(group){return group.section.contains(target);});
    var byQuery=groups.find(function(group){return group.key===new URL(location.href).searchParams.get('year');});
    return {group:byHash||byQuery||groups[0],target:byHash?target:null};
  }
  function show(group,scroll,target,animate){
    groups.forEach(function(item){item.section.hidden=item!==group;});select.value=group.key;
    status.textContent=group.count+' '+(group.count===1?'seminar':'seminars');
    if(scroll)requestAnimationFrame(function(){(target && target!==group.heading?target:header).scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});});
    if(animate && !reduced.matches && group.section.animate)group.section.animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
  }
  select.addEventListener('change',function(){var group=groups.find(function(item){return item.key===select.value;});var url=new URL(location.href);url.searchParams.set('year',group.key);url.hash=group.heading.id;history.pushState({year:group.key},'',url.href);show(group,true,null,true);});
  function restore(){var chosen=selection();show(chosen.group,true,chosen.target,false);}
  window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);
  var chosen=selection();show(chosen.group,Boolean(location.hash||new URL(location.href).searchParams.has('year')),chosen.target,false);
})();

/* Links should look like links; external resources have a small direction marker. */
(function(){
  'use strict';
  document.querySelectorAll('#main-content a[href]').forEach(function(a){
    var href=a.getAttribute('href');if(!href || href[0]==='#' || a.querySelector('img'))return;
    a.classList.add('content-link');
    try{var url=new URL(href,location.href);if(/^https?:$/.test(url.protocol) && url.origin!==location.origin && !/↗$/.test(a.textContent.trim()))a.classList.add('external-resource');}catch(_){}
  });
  document.querySelectorAll('.person-links').forEach(function(p){Array.from(p.childNodes).forEach(function(node){if(node.nodeType===3 && /^[\s·]*$/.test(node.textContent))node.remove();});});
})();


/* One-time entrance effects; the content stays visible without JS or with reduced motion. */
(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches || !('IntersectionObserver' in window))return;
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px 35px 0px'});
  function reveal(el,index){el.classList.add('reveal-entry');el.style.setProperty('--entry-delay',Math.min(index%3,2)*45+'ms');observer.observe(el);}
  document.querySelectorAll('.people-entry,.organizer-card,.seminar-archive .event-table tbody tr,#main-content>h1,#main-content>h2,#main-content>p,#main-content>ul,.gran-sasso-banner img,.academic-year-section>h3').forEach(reveal);
  document.addEventListener('focusin',function(event){var item=event.target.closest('.reveal-entry');if(item)item.classList.add('is-visible');});
  reduced.addEventListener('change',function(event){if(event.matches){document.querySelectorAll('.reveal-entry').forEach(function(el){el.classList.add('is-visible');});observer.disconnect();}});
})();
