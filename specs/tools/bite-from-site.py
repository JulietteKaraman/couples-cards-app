#!/usr/bin/env python3
"""Turn a site bite page into app content, her wording untouched.
Usage: bite-from-site.py SITE_ROOT APP_ROOT CONFIG.json
Writes lib/content/bites/<short>.ts and copies media to public/bites/<slug>/."""
import sys,re,json,os,shutil,html as H
from PIL import Image,ImageOps
SITE,APP,CFG=sys.argv[1:4]
cfgs=json.load(open(CFG))
VOID={'img','br','input','hr','source','meta','link'}
TAG=re.compile(r'<!--.*?-->|<(/?)([a-zA-Z0-9]+)((?:\s+[^<>]*?)?)(/?)>',re.S)
def kids(s):
    out=[];depth=0;start=None;name=None
    for m in TAG.finditer(s):
        if m.group(0).startswith('<!--'): continue
        close,t,attrs,sc=m.group(1),m.group(2).lower(),m.group(3),m.group(4)
        if t in VOID or sc:
            if depth==0: out.append(dict(tag=t,attrs=attrs,html=m.group(0),inner=''))
            continue
        if not close:
            if depth==0: start=m.start();name=t;a=attrs;istart=m.end()
            depth+=1
        else:
            depth-=1
            if depth==0: out.append(dict(tag=name,attrs=a,html=s[start:m.end()],inner=s[istart:m.start()]))
    return out
def attr(el,n):
    m=re.search(r'\b'+n+r'="([^"]*)"',el['attrs']);return H.unescape(m.group(1)) if m else ''
def cls(el): return attr(el,'class').split()
def text(s): return re.sub(r'\s+',' ',H.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
def find(s,c):
    for m in re.finditer(r'<(\w+)[^<>]*class="([^"]*)"[^<>]*>',s):
        if c in m.group(2).split():
            d=0
            for t in TAG.finditer(s,m.start()):
                if t.group(0).startswith('<!--'): continue
                n=t.group(2).lower()
                if n in VOID or t.group(4): continue
                d+= -1 if t.group(1) else 1
                if d==0: return s[m.end():t.start()]
    return None
for c in cfgs:
    src=f"{SITE}/{c['site']}";h=open(src+'/index.html').read();slug=c['slug'];pub=f"{APP}/public/bites/{slug}"
    os.makedirs(pub+'/voice',exist_ok=True);main=h[h.index('<main'):h.index('</main>')]
    def media(rel):
        d=rel.replace('media/','');t=f"{pub}/{d}";os.makedirs(os.path.dirname(t),exist_ok=True)
        if not os.path.exists(t): shutil.copy(f"{src}/media/{d}",t)
        return f"/bites/{slug}/{d}"
    def fix(s):
        s=re.sub(r'src="(media/[^"]+)"',lambda m:f'src="{media(m.group(1))}"',s)
        return re.sub(r'\n\s*','\n',s).strip()
    def photo(p):
        name=p['file'].split('/')[-1].lower();t=f"{pub}/photos/{name}";os.makedirs(pub+'/photos',exist_ok=True)
        if name.endswith('.png'):
            im=Image.open(p['file']).convert('RGBA');im=im.resize((640,round(im.height*640/im.width)),Image.LANCZOS);im.save(t,optimize=True)
            return {k:v for k,v in dict(type='photo',src=f"/bites/{slug}/photos/{name}",alt=p['alt'],ratio=f"{im.width} / {im.height}",maxW=p.get('maxW',270),plain=True,caption=p.get('caption')).items() if v}
        s=p['file'] if p['file'].startswith('/') else f"{src}/media/{p['file']}"
        im=ImageOps.exif_transpose(Image.open(s)).convert('RGB')
        if im.width>1000: im=im.resize((1000,round(im.height*1000/im.width)),Image.LANCZOS)
        im.save(t,quality=84,optimize=True)
        return {k:v for k,v in dict(type='photo',src=f"/bites/{slug}/photos/{name}",alt=p['alt'],pos=f"50% {p.get('y',50)}%",ratio=p.get('ratio','4 / 5'),maxW=p.get('maxW'),caption=p.get('caption')).items() if v}
    vimeo=lambda s:(re.search(r'player\.vimeo\.com/video/(\d+)',s) or [None,None])[1]
    RATIO={'1223340072':'9 / 16','1231988543':'9 / 16','1231230353':'16 / 9','1223332935':'16 / 9','1223329859':'16 / 9','1235783730':'1 / 0.6716'}
    def parse_media(el):
        s=el['inner'];cl=cls(el);hd=find(s,'hd') or '';lab=text(find(hd,'lab') or '');tt=find(hd,'tt') or '';title=text(re.sub(r'<small>.*?</small>','',tt,flags=re.S));sm=re.search(r'<small>(.*?)</small>',tt,re.S);small=text(sm.group(1)) if sm else ''
        out=[]
        vs=vimeo(s);au=re.search(r'data-src="(media/[^"]+\.(?:m4a|mp3))"|<audio[^>]*src="(media/[^"]+)"',s);ausrc=au and (au.group(1) or au.group(2))
        if 'lw' in re.findall(r'class="(\w+)"',s):
            btn=re.findall(r'<button[^>]*data-p="([^"]+)"[^>]*>(.*?)</button>',s);wl=[t for k,t in btn if 'watch' in k][0];ll=[t for k,t in btn if 'listen' in k][0];first='watch' if 'watch' in btn[0][0] else 'listen'
            panes=re.findall(r'<div class="pane"[^>]*id="[^"]*(watch|listen)"[^>]*>(.*?)</div>\s*(?=<div class="pane"|</div>\s*$|$)',s,re.S)
            wn=re.search(r'id="\w+-watch".*?<div class="bd"[^>]*>(.*?)</div>',s,re.S);ln=re.search(r'id="\w+-listen"[^>]*>\s*<div class="bd"[^>]*>(.*?)</div>',s,re.S)
            wn_=''
            m=re.search(r'id="\w+-watch"(.*?)(?:id="\w+-listen"|$)',s,re.S)
            if m:
                b=re.search(r'<div class="bd"[^>]*>(.*?)</div>',m.group(1),re.S);wn_=text(b.group(1)) if b else ''
            m=re.search(r'id="\w+-listen"(.*?)(?:id="\w+-watch"|$)',s,re.S);ln_=''
            if m:
                b=re.search(r'<div class="bd"[^>]*>(.*?)</div>',m.group(1),re.S);ln_=text(b.group(1)) if b else ''
            return [dict(type='watchListen',lab=lab,title=title,vimeo=vs,ratio=RATIO[vs],watchLabel=H.unescape(wl),listenLabel=H.unescape(ll),watchNote=wn_,listenNote=ln_,src=media(ausrc),first=first)]
        img=re.search(r'<img src="(media/[^"]+)"',s)
        if img and img.group(1) in c.get('inlinePhotos',{}): out.append(photo(c['inlinePhotos'][img.group(1)]))
        bd=find(s,'bd');note=text(bd) if bd else ''
        if vs and 'vid' in s:
            vl=re.search(r'class="vlink"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',s,re.S)
            out.append({k:v for k,v in dict(type='video',lab=lab,title=title,small=small,vimeo=vs,ratio=RATIO[vs],note=note,linkHref=vl and vl.group(1),linkText=vl and text(vl.group(2))).items() if v})
        elif ausrc:
            b=dict(type='voice',lab=lab,title=title,small=small,note=note,src=media(ausrc),id=attr(el,'id'))
            if 'data-welcome' in el['attrs']: b['welcome']=True
            out.append({k:v for k,v in b.items() if v})
        return out
    def blocks(s):
        out=[];buf=[];ks=kids(s)
        def flush():
            if buf: out.append(dict(type='html',html=fix('\n'.join(buf))));buf.clear()
        i=0
        while i<len(ks):
            e=ks[i];cl=cls(e);i+=1
            if e['tag']=='figure':
                im=re.search(r'src="(media/[^"]+)"',e['inner'])
                if im and im.group(1) in c.get('inlinePhotos',{}): flush();out.append(photo(c['inlinePhotos'][im.group(1)]))
                continue
            if 'media' in cl and e['tag']=='div': flush();out.extend(parse_media(e));continue
            if 'more' in cl: continue
            if 'timer' in cl: flush();out.append(dict(type='timer',min=int(attr(e,'data-min'))));continue
            if 'dyad' in cl:
                flush();out.append({k:v for k,v in dict(type='dyad',cat=attr(e,'data-cat'),prompt=attr(e,'data-prompt'),back1=attr(e,'data-back1'),back2=attr(e,'data-back2'),min=int(attr(e,'data-min')),after=attr(e,'data-after').lstrip('#')).items() if v});continue
            if 'check' in cl:
                flush();items=[re.sub(r'\s+',' ',H.unescape(x)).strip() for x in re.findall(r'<span class="bx"></span><span>(.*?)</span>',e['inner'],re.S)];b=dict(type='check',items=items)
                if i<len(ks) and 'ready' in cls(ks[i]): b['ready']=text(ks[i]['inner']);i+=1
                out.append(b);continue
            if 'roles' in cl:
                flush();q=text(find(e['inner'],'q') or '');hint=text(find(e['inner'],'hint') or '');tabs=[(a,H.unescape(t)) for a,t in re.findall(r'<button data-r="(\w+)"[^>]*>(.*?)</button>',e['inner'])];cards=[]
                while i<len(ks) and 'rolecard' in cls(ks[i]) and attr(ks[i],'data-role'):
                    cards.append(dict(role=attr(ks[i],'data-role'),html=fix(ks[i]['inner'])));i+=1
                out.append(dict(type='roles',q=q,hint=hint,tabs=tabs,cards=cards));continue
            if 'path' in cl:
                flush();lab=text(find(e['inner'],'lab') or '');opts=re.findall(r'<button type="button" data-a="(\w+)">(.*?)</button>',e['inner']);ps=dict(re.findall(r'<div data-p="(\w+)" hidden>(.*?)</div>',e['inner'],re.S))
                out.append(dict(type='path',lab=lab,options=[dict(label=H.unescape(t),html=fix(ps.get(a,''))) for a,t in opts]));continue
            if 'resp' in cl or 'terr' in cl:
                flush();items=[]
                for k in kids(e['inner']):
                    bb=re.search(r'<b>(.*?)</b>',k['inner'],re.S);sp=re.search(r'<span>(.*?)</span>',k['inner'],re.S);sm=re.search(r'<small>(.*?)</small>',k['inner'],re.S);ii=re.search(r'<i>(.*?)</i>',k['inner'],re.S);mo=find(k['inner'],'more2')
                    items.append({x:y for x,y in dict(b=text(bb.group(1)),span=text(sp.group(1)),small=sm and text(sm.group(1)),i=ii and text(ii.group(1)),html=mo and fix(mo)).items() if y})
                out.append(dict(type='resp',items=items));continue
            if 'cta' in cl:
                flush();sm=re.search(r'<small>(.*?)</small>',e['inner'],re.S);out.append({k:v for k,v in dict(type='cta',href=attr(e,'href'),text=text(re.sub(r'<small>.*?</small>','',e['inner'],flags=re.S)),small=sm and text(sm.group(1))).items() if v});continue
            buf.append(e['html'])
        flush();return out
    steps=[];name=dict((a,text(b)) for a,b in re.findall(r'<a href="#(\w+)">(.*?)</a>',h[h.index('id="chips"'):h.index('</nav>',h.index('id="chips"'))]))
    for m in re.finditer(r'<section(?: id="(\w+)")?(?: class="(\w+)")?[^>]*>',main):
        id_=m.group(1) or m.group(2);j=m.end();d=1
        for t in re.finditer(r'<(/?)section\b',main[j:]):
            d+= -1 if t.group(1) else 1
            if d==0: inner=main[j:j+t.start()];break
        st=dict(id=id_,name=c.get('names',{}).get(id_) or name.get(id_) or id_,blocks=blocks(inner))
        for inj in c.get('inject',{}).get(id_,[]):
            bl=dict(inj['block'])
            if bl['type']=='appTour': bl['screens']=[dict(photo(x['photo']),caption=x['caption']) for x in bl['screens']]
            if bl['type']=='photo': bl=photo(bl)
            st['blocks'].insert(inj['at'] if inj['at']>=0 else len(st['blocks']),bl)
        if id_ in c['photos']: st['photo']=photo(c['photos'][id_])
        steps.append(st)
    cover=h[h.index('<header class="cover"'):h.index('</header>')]
    out=dict(slug=slug,short=c['short'],title=text(re.search(r'<h1[^>]*>(.*?)</h1>',cover,re.S).group(1)),line=re.search(r'<p class="line">(.*?)</p>',cover,re.S).group(1),meta=' · '.join(text(x) for x in re.findall(r'<span>(.*?)</span>',find(cover,'meta'))),hero=photo(c['hero']),me=media('media/hub/me.jpg'),checkinStep=c['checkinStep'],doneLine=c['doneLine'],doorImg='/the-full-stop/up-31tp.jpg',steps=steps)
    os.makedirs(f"{APP}/lib/content/bites",exist_ok=True)
    open(f"{APP}/lib/content/bites/{c['short']}.ts",'w').write("// Her wording, taken unchanged from the site page by specs/tools/bite-from-site.py. Do not retype.\nimport type { Bite } from \"@/components/BitePage\";\n\nexport const BITE = "+json.dumps(out,ensure_ascii=False,indent=2)+" as unknown as Bite;\n")
    print(slug,[ (s['id'],[b['type'] for b in s['blocks']]) for s in steps])
