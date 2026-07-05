import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Award, Clapperboard, Compass, Film, Flame, Grid3X3, Home, Mail, Menu, Search, ShieldCheck, Sparkles, Star, Ticket, Trophy, Tv, X } from "lucide-react";
import { channels, movies, collections } from "./data/catalog";
import "./styles.css";

const nav = [
  ["首页", "home", Home],
  ["全部影片", "library", Clapperboard],
  ["分类频道", "channels", Grid3X3],
  ["热播榜", "rank", Trophy],
  ["搜索", "search", Search],
  ["服务支持", "service", ShieldCheck]
];

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("全部");
  const [movie, setMovie] = useState(null);
  const [menu, setMenu] = useState(false);
  const filtered = useMemo(() => movies.filter((item) => {
    const text = `${item.title} ${item.channel} ${item.area} ${item.year} ${item.state}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (channel === "全部" || item.channel === channel);
  }), [query, channel]);
  const go = (next) => { setPage(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <Header page={page} go={go} menu={menu} setMenu={setMenu} />
      <main>
        {page === "home" && <HomePage go={go} setMovie={setMovie} />}
        {page === "library" && <Library filtered={filtered} query={query} setQuery={setQuery} channel={channel} setChannel={setChannel} setMovie={setMovie} />}
        {page === "channels" && <Channels go={go} setChannel={setChannel} />}
        {page === "rank" && <Ranking setMovie={setMovie} />}
        {page === "search" && <SearchPage query={query} setQuery={setQuery} filtered={filtered} setMovie={setMovie} />}
        {page === "service" && <Service />}
      </main>
      <Footer go={go} />
      {movie && <MovieSheet movie={movie} close={() => setMovie(null)} />}
    </>
  );
}

function Header({ page, go, menu, setMenu }) {
  return (
    <header className="header">
      <button className="brand" onClick={() => go("home")}><span>映</span><b>日韩影视网</b></button>
      <button className="menu-btn" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <nav className={menu ? "nav open" : "nav"}>
        {nav.map(([label, key, Icon]) => <button key={key} className={page === key ? "active" : ""} onClick={() => go(key)}><Icon size={16} />{label}</button>)}
      </nav>
    </header>
  );
}

function HomePage({ go, setMovie }) {
  const hero = movies[0];
  return (
    <>
      <section className="cinema-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,10,16,.94), rgba(7,10,16,.38)), url(${hero.scene})` }}>
        <div className="hero-text">
          <span className="hot"><Sparkles size={14} /> 沉浸式片库</span>
          <h1>日韩电影电视剧专题放映厅</h1>
          <p>{hero.plot} 这里整理热播韩剧、日剧推荐、日韩电影、动漫综艺和高分榜单。</p>
          <div className="actions"><button onClick={() => setMovie(hero)}>查看详情</button><button onClick={() => go("library")}>浏览全部影片</button></div>
        </div>
        <div className="hero-strip">
          {movies.slice(1, 7).map((item) => <button key={item.id} onClick={() => setMovie(item)}><img src={item.poster} alt={item.title} /><b>{item.title}</b></button>)}
        </div>
      </section>

      <Section title="今日精选" label="Today Picks" action="全部影片" onAction={() => go("library")}>
        <PosterGrid list={movies.slice(7, 19)} setMovie={setMovie} />
      </Section>

      <Section title="专题片单" label="Collections" action="分类频道" onAction={() => go("channels")}>
        <CollectionGrid setMovie={setMovie} />
      </Section>

      <Section title="日韩热播" label="Hot Stream" action="热播榜" onAction={() => go("rank")}>
        <CinemaRail list={movies.slice(19, 31)} setMovie={setMovie} />
      </Section>

      <Section title="最新上架" label="New Release" action="搜索片库" onAction={() => go("search")}>
        <UpdateRows list={movies.slice(31, 45)} setMovie={setMovie} />
      </Section>

      <section className="channel-panel">
        <Head title="分类频道" label="Channels" action="进入频道" onAction={() => go("channels")} />
        <ChannelGrid go={go} setChannel={() => {}} />
      </section>

      <section className="split">
        <div><Head title="高分推荐" label="Top Rated" /><MiniList list={[...movies].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 8)} setMovie={setMovie} /></div>
        <div><Head title="热播榜入口" label="Ranking" action="完整榜单" onAction={() => go("rank")} /><RankPreview list={movies.slice(0, 8)} setMovie={setMovie} /></div>
      </section>
    </>
  );
}

function Library({ filtered, query, setQuery, channel, setChannel, setMovie }) {
  return (
    <>
      <PageTitle title="全部影片" label="Library" text="浏览日韩精选、韩剧热播、日剧推荐、日本电影、韩国电影、动作冒险、悬疑犯罪、爱情治愈、喜剧综艺和动漫动画。" />
      <Filters query={query} setQuery={setQuery} channel={channel} setChannel={setChannel} />
      <PosterGrid list={filtered} setMovie={setMovie} dense />
    </>
  );
}

function Channels({ go, setChannel }) {
  return <><PageTitle title="分类频道" label="Channels" text="按题材、地区和观看心情进入不同频道，快速找到适合今天观看的内容。" /><ChannelGrid go={go} setChannel={setChannel} large /></>;
}

function Ranking({ setMovie }) {
  return (
    <>
      <PageTitle title="热播榜" label="Ranking" text="按热度、评分和更新状态整理近期更受关注的日韩影视内容。" />
      <div className="rank-list">{[...movies].sort((a, b) => b.heat - a.heat).slice(0, 60).map((item, index) => <button key={item.id} onClick={() => setMovie(item)}><strong>{index + 1}</strong><img src={item.poster} alt={item.title} /><span><b>{item.title}</b><em>{item.channel} · {item.area} · {item.year}</em></span><i>{item.score}</i></button>)}</div>
    </>
  );
}

function SearchPage({ query, setQuery, filtered, setMovie }) {
  return <><PageTitle title="搜索片库" label="Search" text="输入片名、分类、地区、年份或更新状态，快速筛选站内影视内容。" /><div className="searchbar"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：悬疑、韩剧、2026、日本电影" autoFocus /></div><PosterGrid list={filtered} setMovie={setMovie} dense /></>;
}

function Service() {
  return (
    <section className="service">
      <span>Support</span><h1>服务支持</h1><p>日韩影视网专注影视资料整理、分类索引与内容推荐，帮助用户发现更多值得关注的日韩影视作品。</p>
      <div className="service-grid">
        <article><Film /><h2>网站说明</h2><p>站内内容用于影视资料整理、片单推荐和分类索引展示。</p></article>
        <article><ShieldCheck /><h2>版权声明</h2><p>片名、海报和文字介绍版权归原作者、出品方及发行方所有。</p></article>
        <article><Mail /><h2>联系合作</h2><p>内容纠错、友情链接和合作事宜，可通过站点预留邮箱联系。</p></article>
      </div>
      <h2>免责声明</h2><p>本站不存储任何视频文件，不提供影视文件上传服务。如权利方认为页面信息需要调整，请提交说明，我们会及时处理。</p>
    </section>
  );
}

function Section({ title, label, action, onAction, children }) {
  return <section className="section"><Head title={title} label={label} action={action} onAction={onAction} />{children}</section>;
}

function Head({ title, label, action, onAction }) {
  return <div className="head"><div><span>{label}</span><h2>{title}</h2></div>{action && <button onClick={onAction}>{action}</button>}</div>;
}

function PageTitle({ title, label, text }) {
  return <section className="page-title"><span>{label}</span><h1>{title}</h1><p>{text}</p></section>;
}

function PosterGrid({ list, setMovie, dense }) {
  return <div className={dense ? "poster-grid dense" : "poster-grid"}>{list.map((item) => <Poster key={item.id} item={item} setMovie={setMovie} />)}</div>;
}

function Poster({ item, setMovie }) {
  return <button className="poster-card" onClick={() => setMovie(item)}><div><img src={item.poster} alt={item.title} loading="lazy" /><span>{item.channel}</span><b>{item.score}</b></div><strong>{item.title}</strong><em>{item.area} · {item.year} · {item.state}</em></button>;
}

function CollectionGrid({ setMovie }) {
  return <div className="collections">{collections.map((col, index) => <article key={col.title}><div>{col.ids.slice(0, 3).map((id) => <img key={id} src={movies[id - 1].poster} alt={movies[id - 1].title} />)}</div><span>专题 {index + 1}</span><h3>{col.title}</h3><p>{col.text}</p><button onClick={() => setMovie(movies[col.ids[0] - 1])}>查看片单</button></article>)}</div>;
}

function CinemaRail({ list, setMovie }) {
  return <div className="cinema-rail">{list.map((item) => <button key={item.id} onClick={() => setMovie(item)} style={{ backgroundImage: `linear-gradient(0deg, rgba(6,9,15,.82), rgba(6,9,15,.08)), url(${item.scene})` }}><span>{item.channel}</span><strong>{item.title}</strong><em>{item.score} 分 · {item.state}</em></button>)}</div>;
}

function UpdateRows({ list, setMovie }) {
  return <div className="updates">{list.map((item, index) => <button key={item.id} onClick={() => setMovie(item)}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{item.title}</strong><em>{item.channel} · {item.area} · {item.year}</em></span><i>{item.state}</i></button>)}</div>;
}

function ChannelGrid({ go, setChannel, large }) {
  return <div className={large ? "channels large" : "channels"}>{channels.map((item, index) => <button key={item.name} onClick={() => { setChannel(item.name); go("library"); }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><em>{item.copy}</em><b>{movies.filter((movie) => movie.channel === item.name).length} 部</b></button>)}</div>;
}

function MiniList({ list, setMovie }) {
  return <div className="mini-list">{list.map((item) => <button key={item.id} onClick={() => setMovie(item)}><img src={item.poster} alt={item.title} /><span><strong>{item.title}</strong><em>{item.channel} · {item.score} 分</em></span></button>)}</div>;
}

function RankPreview({ list, setMovie }) {
  return <div className="rank-preview">{list.map((item, index) => <button key={item.id} onClick={() => setMovie(item)}><b>{index + 1}</b><span>{item.title}</span><em>{item.heat}</em></button>)}</div>;
}

function Filters({ query, setQuery, channel, setChannel }) {
  return <section className="filters"><div><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索影片名、分类、地区或年份" /></div><nav>{["全部", ...channels.map((item) => item.name)].map((name) => <button key={name} className={channel === name ? "active" : ""} onClick={() => setChannel(name)}>{name}</button>)}</nav></section>;
}

function MovieSheet({ movie, close }) {
  return <div className="overlay" onClick={close}><article className="sheet" onClick={(event) => event.stopPropagation()}><button className="close" onClick={close}><X /></button><div className="sheet-bg" style={{ backgroundImage: `linear-gradient(90deg, rgba(6,9,15,.94), rgba(6,9,15,.42)), url(${movie.scene})` }}><img src={movie.poster} alt={movie.title} /><section><span className="hot"><Tv size={14} /> {movie.channel}</span><h2>{movie.title}</h2><div className="meta"><span><Star size={14} /> {movie.score}</span><span>{movie.area}</span><span>{movie.year}</span><span>{movie.state}</span></div><p>{movie.plot}</p><dl><dt>导演</dt><dd>{movie.director}</dd><dt>主演</dt><dd>{movie.cast}</dd></dl><button onClick={close}>继续浏览</button></section></div></article></div>;
}

function Footer({ go }) {
  return <footer className="footer"><div><strong>日韩影视网</strong><p>专注日韩电影、电视剧、综艺与动漫内容整理，发现更多值得观看的亚洲影像故事。</p></div><nav><button onClick={() => go("library")}>全部影片</button><button onClick={() => go("channels")}>分类频道</button><button onClick={() => go("rank")}>热播榜</button><button onClick={() => go("service")}>免责声明</button></nav><div><b>友情链接</b><a href="#">日韩剧场</a><a href="#">亚洲影评</a><a href="#">电影片单</a></div><p className="copy">© 2026 日韩影视网. 本站仅提供影视信息整理与推荐，相关版权归原作者及发行方所有。联系邮箱：contact@example.com</p></footer>;
}

createRoot(document.getElementById("root")).render(<App />);

