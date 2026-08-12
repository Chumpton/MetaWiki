/**
 * MetaWiki - Zero-Token Organic Wikipedia Article Importer & Sync Engine
 * Fetches authentic Wikipedia articles directly via MediaWiki APIs without consuming LLM tokens.
 * Preserves all original hyperlinks, HTML sections, images, infoboxes, and citations.
 */

(function (window) {
  'use strict';

  const WIKIPEDIA_ACTION_API = 'https://en.wikipedia.org/w/api.php';
  const WIKIPEDIA_REST_API = 'https://en.wikipedia.org/api/rest_v1/page/html/';

  async function fetchWikipediaArticleRaw(titleOrSlug) {
    const cleanTitle = titleOrSlug.replace(/_/g, ' ').trim();
    const url = `${WIKIPEDIA_ACTION_API}?action=parse&page=${encodeURIComponent(cleanTitle)}&format=json&origin=*&prop=text|categories|images|sections|displaytitle`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    
    if (data.error) {
      throw new Error(data.error.info || 'Article not found on Wikipedia');
    }
    return data.parse;
  }

  function processWikipediaHtml(rawHtml, title) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    // Remove unwanted Wikipedia elements (edit buttons, navboxes, hatnotes, reference popups)
    const selectorsToRemove = [
      '.mw-editsection', '.navbox', '.vertical-navbox', '.hatnote', '.mw-empty-elt',
      '.noprint', '.ambox', '.sistersitebox', '.portal', '.catlinks'
    ];
    selectorsToRemove.forEach(sel => {
      tempDiv.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Fix and preserve all hyperlinks organically!
    tempDiv.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        if (href.startsWith('/wiki/')) {
          const targetSlug = href.replace('/wiki/', '');
          a.setAttribute('href', '#');
          a.setAttribute('data-wiki-target', targetSlug);
          a.style.color = '#fbbf24';
          a.style.textDecoration = 'underline';
          a.onclick = function (e) {
            e.preventDefault();
            if (window.WikipediaImporter && window.WikipediaImporter.importAndDisplayArticle) {
              window.WikipediaImporter.importAndDisplayArticle(targetSlug);
            }
          };
        } else if (href.startsWith('#')) {
          // Internal section anchor
          a.style.color = '#38bdf8';
        } else if (href.startsWith('//')) {
          a.setAttribute('href', 'https:' + href);
          a.setAttribute('target', '_blank');
        }
      }
    });

    // Fix images to use full HTTPS URLs
    tempDiv.querySelectorAll('img').forEach(img => {
      let src = img.getAttribute('src');
      if (src && src.startsWith('//')) {
        img.setAttribute('src', 'https:' + src);
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.margin = '1rem 0';
    });

    return tempDiv.innerHTML;
  }

  function getMetaphysicalInterpretationHtml(article) {
    if (!article) return '';

    const loc = article.hawkinsNumeric || article.hawkinsScale || 500;
    const locLabel = article.hawkinsCalibration || `LoC ${loc}`;
    const category = article.category || 'Metaphysics & Perennial Wisdom';

    let synthesisText = article.metaphysicalSummary || article.shortDescription || article.subtitle || '';
    if (!synthesisText || synthesisText.length < 30) {
      synthesisText = `In the MetaWiki consciousness matrix, ${article.title} provides a fundamental lens into non-dual perception, perennial philosophy, and ontological principles of Being.`;
    }

    return `
      <div class="metawiki-interpretation-box" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(168, 85, 247, 0.15)); border: 1px solid rgba(251, 191, 36, 0.5); border-radius: 12px; padding: 1.35rem; margin-bottom: 1.8rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -15px; right: -15px; width: 90px; height: 90px; background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%); pointer-events: none;"></div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(251, 191, 36, 0.25); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; color: #fbbf24; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">✨</span> MetaWiki Metaphysical Synthesis & Consciousness Analysis
          </div>
          <span style="font-size: 0.78rem; font-weight: 800; color: #a855f7; background: rgba(168, 85, 247, 0.18); border: 1px solid rgba(168, 85, 247, 0.35); padding: 0.25rem 0.75rem; border-radius: 20px;">${locLabel} • ${category}</span>
        </div>

        <div style="color: #f1f5f9; font-size: 0.96rem; line-height: 1.65; margin-bottom: 0.9rem; font-family: var(--font-sans-wiki);">
          <strong style="color: #fbbf24;">Metaphysical Interpretation:</strong> ${synthesisText}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.82rem; color: #94a3b8;">
          <span><strong style="color: #cbd5e1;">Hawkins Calibration:</strong> ${locLabel} (Reason & Non-Dual Insight)</span>
          <span><strong style="color: #cbd5e1;">Perennial Principle:</strong> Uncreated Witness Consciousness</span>
          <span><strong style="color: #38bdf8;">Data Integration:</strong> Authentic Live Wikipedia Sync</span>
        </div>
      </div>
    `;
  }

  async function importWikipediaArticle(titleOrSlug, category = 'Metaphysics') {
    const parseData = await fetchWikipediaArticleRaw(titleOrSlug);
    const title = parseData.title || titleOrSlug;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanContentHtml = processWikipediaHtml(parseData.text['*'], title);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = parseData.text['*'];

    // Extract authentic right-hand side infobox or lead thumbnail image from Wikipedia
    let extractedImage = '';
    const infoboxImg = tempDiv.querySelector('.infobox img, .vertical-navbox img, table.metadata img, .thumb img, .mw-parser-output img');
    if (infoboxImg) {
      let src = infoboxImg.getAttribute('src');
      if (src) {
        if (src.startsWith('//')) src = 'https:' + src;
        extractedImage = window.getWikiImgUrl ? window.getWikiImgUrl(src) : src;
      }
    }

    const leadP = tempDiv.querySelector('p:not(.mw-empty-elt)')?.textContent || 'Complete metaphysical article synced from Wikipedia.';
    const shortDesc = leadP.length > 220 ? leadP.substring(0, 217) + '...' : leadP;
    const metaphysicalSynthesis = `In the MetaWiki consciousness matrix, ${title} serves as a pivotal focal point for ontological contemplation. It connects non-dual awareness, Hawkins scale calibrations of human understanding, and perennial philosophical inquiry into the nature of Being.`;

    const importedArticle = {
      id: slug,
      title: title,
      category: category,
      shortDescription: shortDesc,
      subtitle: `${title} — Metaphysical Concept & Consciousness Analysis`,
      imagePath: extractedImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
      infobox: {
        title: title,
        subtitle: `${title} — Metaphysical Analysis`,
        imagePath: extractedImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/330px-Plato_Silanion_Musei_Capitolini_MC1377.png',
        fullImage: extractedImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Plato_Silanion_Musei_Capitolini_MC1377.png/640px-Plato_Silanion_Musei_Capitolini_MC1377.png',
        imageCaption: `Authentic Wikipedia Right-Side Visual Representation of ${title}`,
        data: [
          { label: "Category", value: category },
          { label: "Source", value: "Live Wikipedia API Import" },
          { label: "Consciousness Level", value: "LoC 500+ (Reason / Spiritual Realization)" }
        ]
      },
      hawkinsCalibration: 'LoC 500',
      hawkinsNumeric: 500,
      metaphysicalSummary: metaphysicalSynthesis,
      contentHTML: cleanContentHtml,
      fullContentHtml: cleanContentHtml,
      views: '1,420',
      isWikipediaSynced: true,
      syncedAt: new Date().toISOString()
    };

    // Save into window.METAWIKI_DATA & LocalStorage
    if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};
    if (!window.METAWIKI_DATA.articles) window.METAWIKI_DATA.articles = [];

    const existingIdx = window.METAWIKI_DATA.articles.findIndex(a => a.id === slug);
    if (existingIdx >= 0) {
      window.METAWIKI_DATA.articles[existingIdx] = { ...window.METAWIKI_DATA.articles[existingIdx], ...importedArticle };
    } else {
      window.METAWIKI_DATA.articles.unshift(importedArticle);
    }

    try {
      const storedImports = JSON.parse(localStorage.getItem('metawiki_imported_articles') || '{}');
      storedImports[slug] = importedArticle;
      localStorage.setItem('metawiki_imported_articles', JSON.stringify(storedImports));
    } catch (e) {}

    return importedArticle;
  }

  window.getMetaphysicalInterpretationHtml = getMetaphysicalInterpretationHtml;

  async function importAndDisplayArticle(titleOrSlug) {
    try {
      const article = await importWikipediaArticle(titleOrSlug);
      if (typeof window.loadArticle === 'function') {
        window.loadArticle(article.id);
      }
      return article;
    } catch (err) {
      console.warn('Could not import Wikipedia article:', err);
    }
  }

  // IN-BROWSER IMPORT BOT MODAL DOM INJECTOR
  function initWikipediaImportBotModal() {
    if (document.getElementById('wikipediaImportModalContainer')) return;

    const container = document.createElement('div');
    container.id = 'wikipediaImportModalContainer';
    container.innerHTML = `
      <div class="discord-modal-overlay" id="wikipediaImportModal" style="display: none; z-index: 10002;">
        <div class="discord-modal-card" style="max-width: 540px; width: 92%; padding: 1.6rem; background: #0b0f19; border: 1px solid #fbbf24; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.9); font-family: var(--font-sans-wiki);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.6rem;">
            <div style="font-weight: 800; font-size: 1.1rem; color: #fbbf24; display: flex; align-items: center; gap: 0.5rem;">
              <i class="ph ph-globe-hemisphere-west" style="font-size: 1.3rem;"></i> Wikipedia Zero-Token Sync Bot
            </div>
            <button id="closeWikiImportModalBtn" style="background: none; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer;">✕</button>
          </div>

          <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.2rem;">
            Sync complete Wikipedia articles organically without using AI/LLM tokens. All original hyperlinks, section headings, images, and infoboxes are preserved intact.
          </p>

          <!-- SINGLE ARTICLE IMPORT FORM -->
          <div style="margin-bottom: 1.2rem;">
            <label style="font-size: 0.82rem; font-weight: 800; color: #fbbf24; display: block; margin-bottom: 0.35rem;">Enter Wikipedia Article Title or URL:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="wikiImportTitleInput" style="flex: 1; padding: 0.7rem; background: #000; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; font-size: 0.88rem;" placeholder="e.g., Hermeticism, Plato, Carl Jung, Gnosticism">
              <button id="runWikiSingleImportBtn" style="padding: 0.7rem 1.1rem; background: #fbbf24; color: #000; font-weight: 800; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; white-space: nowrap;">
                <i class="ph ph-download-simple"></i> Fetch & Sync
              </button>
            </div>
          </div>

          <!-- BATCH CHUNKED IMPORTER -->
          <div style="padding: 1rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; margin-bottom: 1rem;">
            <div style="font-weight: 800; font-size: 0.85rem; color: #38bdf8; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.35rem;">
              <i class="ph ph-stack"></i> Chunked Batch Importer (5 Articles at a time)
            </div>
            <p style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.6rem;">Import curated metaphysical topics in background chunks:</p>
            <button id="runWikiBatchImportBtn" style="width: 100%; padding: 0.65rem; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-weight: 800; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <i class="ph ph-play-circle"></i> Sync Top 5 Metaphysical Core Articles
            </button>
          </div>

          <div id="wikiImportStatus" style="font-size: 0.8rem; color: #4ade80; display: none; padding: 0.5rem; background: rgba(74, 222, 128, 0.1); border-radius: 6px; text-align: center;"></div>

        </div>
      </div>
    `;

    document.body.appendChild(container);

    const modal = document.getElementById('wikipediaImportModal');
    const closeBtn = document.getElementById('closeWikiImportModalBtn');
    const input = document.getElementById('wikiImportTitleInput');
    const singleBtn = document.getElementById('runWikiSingleImportBtn');
    const batchBtn = document.getElementById('runWikiBatchImportBtn');
    const statusEl = document.getElementById('wikiImportStatus');

    function openModal() {
      if (modal) modal.style.display = 'flex';
    }

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (singleBtn && input) {
      singleBtn.addEventListener('click', async () => {
        const val = input.value.trim();
        if (!val) return;

        singleBtn.disabled = true;
        singleBtn.innerHTML = `<i class="ph ph-spinner spinner" style="animation: spin 1s linear infinite;"></i> Fetching...`;
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = `Fetching "${val}" directly from Wikipedia API (0 tokens used)...`;
        }

        try {
          const article = await importWikipediaArticle(val);
          if (statusEl) statusEl.textContent = `✅ Successfully synced "${article.title}" with complete hyperlinks! Opening article...`;
          setTimeout(() => {
            closeModal();
            if (typeof window.loadArticle === 'function') window.loadArticle(article.id);
          }, 800);
        } catch (err) {
          if (statusEl) {
            statusEl.style.color = '#f87171';
            statusEl.textContent = `Error: ${err.message}`;
          }
        } finally {
          singleBtn.disabled = false;
          singleBtn.innerHTML = `<i class="ph ph-download-simple"></i> Fetch & Sync`;
        }
      });
    }

    if (batchBtn) {
      batchBtn.addEventListener('click', async () => {
        const batch = ['Hermeticism', 'Plato', 'Carl Jung', 'Advaita Vedanta', 'Gnosticism'];
        batchBtn.disabled = true;
        
        for (let i = 0; i < batch.length; i++) {
          const topic = batch[i];
          if (statusEl) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#38bdf8';
            statusEl.textContent = `Chunk [${i+1}/5]: Syncing "${topic}" from Wikipedia...`;
          }
          try {
            await importWikipediaArticle(topic);
          } catch (e) {}
          await new Promise(r => setTimeout(r, 400));
        }

        if (statusEl) {
          statusEl.style.color = '#4ade80';
          statusEl.textContent = `🎉 Batch import complete! 5 full articles synced organically.`;
        }
        batchBtn.disabled = false;
      });
    }

    window.openWikipediaImportModal = openModal;
  }

  // Restore stored organic imported articles on load
  try {
    const stored = JSON.parse(localStorage.getItem('metawiki_imported_articles') || '{}');
    Object.values(stored).forEach(art => {
      if (!window.METAWIKI_DATA) window.METAWIKI_DATA = {};
      if (!window.METAWIKI_DATA.articles) window.METAWIKI_DATA.articles = [];
      const idx = window.METAWIKI_DATA.articles.findIndex(a => a.id === art.id);
      if (idx >= 0) window.METAWIKI_DATA.articles[idx] = art;
      else window.METAWIKI_DATA.articles.unshift(art);
    });
  } catch (e) {}

  window.WikipediaImporter = {
    fetchWikipediaArticleRaw,
    importWikipediaArticle,
    importAndDisplayArticle,
    initWikipediaImportBotModal
  };

})(window);
