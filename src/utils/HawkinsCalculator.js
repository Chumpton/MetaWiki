/**
 * MetaWiki - Complete Hawkins Map of Consciousness (Scale of Consciousness) Engine
 * Implements Dr. David R. Hawkins' 17 Calibrated Levels of Consciousness (LoC 20 to 1000).
 */

(function(window) {
  'use strict';

  const HAWKINS_SCALE = [
    {
      loc: 20,
      name: 'Shame',
      emotion: 'Humiliation',
      view: 'Miserable',
      process: 'Elimination',
      color: '#7f1d1d',
      levelGroup: 'Force',
      description: 'Shame is the lowest energy state on the scale, where awareness feels perilously close to self-destruction and unworthiness. It projects a worldview of misery and complete vulnerability.',
      advice: [
        'Practice non-judgmental self-compassion and recognize that feelings are transient states, not core identity.',
        'Seek supportive relationships or grounding contemplative practices to restore foundational self-worth.'
      ]
    },
    {
      loc: 30,
      name: 'Guilt',
      emotion: 'Blame',
      view: 'Evil',
      process: 'Destruction',
      color: '#991b1b',
      levelGroup: 'Force',
      description: 'Guilt expresses through self-condemnation, remorse, and unconscious self-punishment. It perceives existence as inherently sinful or defective.',
      advice: [
        'Forgive past errors by recognizing they stemmed from limited awareness at the time.',
        'Shift focus from punitive self-blame to active, constructive restitution and service.'
      ]
    },
    {
      loc: 50,
      name: 'Apathy',
      emotion: 'Despair',
      view: 'Hopeless',
      process: 'Abdication',
      color: '#b91c1c',
      levelGroup: 'Force',
      description: 'Apathy is characterized by despair, helplessness, and emotional numbness. Energy levels are severely depleted, viewing life as hopeless.',
      advice: [
        'Take small, simple micro-steps each day to break passive inertia.',
        'Engage physically with nature and gentle movement to gently reactivate bodily energy.'
      ]
    },
    {
      loc: 75,
      name: 'Grief',
      emotion: 'Regret',
      view: 'Tragic',
      process: 'Despondency',
      color: '#c2410c',
      levelGroup: 'Force',
      description: 'Grief expresses mourning, regret, and sadness over perceived loss. While painful, it represents more vital energy than apathy.',
      advice: [
        'Allow grief to flow naturally without suppression or intellectual analysis.',
        'Reframe loss by acknowledging the permanent spiritual value of what was loved.'
      ]
    },
    {
      loc: 100,
      name: 'Fear',
      emotion: 'Anxiety',
      view: 'Frightening',
      process: 'Withdrawal',
      color: '#d97706',
      levelGroup: 'Force',
      description: 'Fear perceives the world as dangerous, hostile, and unpredictable, fueling anxiety and hypervigilance. It restricts personal growth through defensive withdrawal.',
      advice: [
        'Anchor awareness in the present moment through breathwork and somatic grounding.',
        'Confront fears incrementally by cultivating trust in your innate resiliency.'
      ]
    },
    {
      loc: 125,
      name: 'Desire',
      emotion: 'Craving',
      view: 'Disappointing',
      process: 'Enslavement',
      color: '#ca8a04',
      levelGroup: 'Force',
      description: 'Desire drives human ambition, craving, and external acquisition, yet leads to perpetual dissatisfaction when fulfillment is sought outside oneself.',
      advice: [
        'Direct desire toward noble, selfless aspirations rather than transient possessions.',
        'Cultivate inner contentment by recognizing that peace is an intrinsic quality of awareness.'
      ]
    },
    {
      loc: 150,
      name: 'Anger',
      emotion: 'Hate',
      view: 'Antagonistic',
      process: 'Aggression',
      color: '#dc2626',
      levelGroup: 'Force',
      description: 'Anger arises from thwarted desire and perceived injustice, expressing through resentment or aggression. When harnessed constructively, it provides energy to overcome stagnation.',
      advice: [
        'Channel passionate energy into constructive action, justice, and positive creation.',
        'Release resentment through forgiveness to prevent emotional burn-out.'
      ]
    },
    {
      loc: 175,
      name: 'Pride',
      emotion: 'Scorn',
      view: 'Demanding',
      process: 'Inflation',
      color: '#ea580c',
      levelGroup: 'Force',
      description: 'Pride seeks self-worth through external status, achievement, and egoic inflation. It feels powerful relative to lower states but remains vulnerable to criticism.',
      advice: [
        'Embrace humility by acknowledging the contributions of others and universal grace.',
        'Shift from needing to be right to valuing authentic truth and shared wisdom.'
      ]
    },
    
    // CRITICAL PIVOT POINT (LoC 200: Force -> Power)
    {
      loc: 200,
      name: 'Courage',
      emotion: 'Affirmation',
      view: 'Feasible',
      process: 'Empowerment',
      color: '#16a34a',
      levelGroup: 'Power',
      description: 'Courage marks the critical threshold where consciousness transitions from Force to true spiritual Power. At LoC 200, one takes full responsibility for one\'s life, choices, and personal growth.',
      advice: [
        'Embrace challenges as catalysts for evolution rather than threats to safety.',
        'Cultivate honesty, integrity, and proactive accountability in all daily actions.'
      ]
    },
    {
      loc: 250,
      name: 'Neutrality',
      emotion: 'Trust',
      view: 'Satisfactory',
      process: 'Release',
      color: '#059669',
      levelGroup: 'Power',
      description: 'Neutrality is characterized by emotional flexibility, non-judgment, and detachment from rigid outcomes. Life is perceived as satisfactory, stable, and unthreatened.',
      advice: [
        'Maintain open-minded adaptability without attached expectations.',
        'Practice witnessing thoughts and events from an unshakeable center of calm.'
      ]
    },
    {
      loc: 310,
      name: 'Willingness',
      emotion: 'Optimism',
      view: 'Hopeful',
      process: 'Intention',
      color: '#0d9488',
      levelGroup: 'Power',
      description: 'Willingness opens the door to rapid personal growth through optimism, enthusiasm, and active participation. Pride is set aside in favor of learning and service.',
      advice: [
        'Say yes to new learning opportunities and embrace continuous self-improvement.',
        'Offer help generously to others without demanding recognition.'
      ]
    },
    {
      loc: 350,
      name: 'Acceptance',
      emotion: 'Forgiveness',
      view: 'Harmonious',
      process: 'Transformation',
      color: '#0284c7',
      levelGroup: 'Power',
      description: 'Acceptance realizes that one is the source and creator of one\'s life experience. Emotional balance is restored through deep forgiveness and harmony.',
      advice: [
        'Relinquish the need to control external events and cultivate inner alignment.',
        'Practice profound forgiveness for yourself and all beings.'
      ]
    },
    {
      loc: 400,
      name: 'Reason',
      emotion: 'Understanding',
      view: 'Meaningful',
      process: 'Abstraction',
      color: '#2563eb',
      levelGroup: 'Power',
      description: 'Reason represents the domain of science, logic, and intellectual mastery. It synthesizes vast information into coherent meaning, though it can become limited by linear rationality.',
      advice: [
        'Balance analytical intellect with intuitive, heart-centered awareness.',
        'Recognize that ultimate truth transcends mental concepts and intellectual paradigms.'
      ]
    },
    {
      loc: 500,
      name: 'Love',
      emotion: 'Reverence',
      view: 'Benign',
      process: 'Revelation',
      color: '#7c3aed',
      levelGroup: 'Power',
      description: 'LoC 500 Love is unconditional, unshakeable, and permanent — a state of being rather than a fleeting emotion. It radiates reverence, compassion, and healing to all life.',
      advice: [
        'Practice loving-kindness toward all beings regardless of external behavior.',
        'Surrender the egoic \'I\' to the universal presence of Divine Love.'
      ]
    },
    {
      loc: 540,
      name: 'Joy',
      emotion: 'Serenity',
      view: 'Complete',
      process: 'Transfiguration',
      color: '#9333ea',
      levelGroup: 'Power',
      description: 'Joy arises as an inner radiance as love becomes increasingly unconditional. It is marked by deep serenity, spontaneous healing, and profound compassion.',
      advice: [
        'Rest deeply in the silent presence of the Present Moment.',
        'Engage in selfless service (Seva) to allow divine joy to flow uninhibited through you.'
      ]
    },
    {
      loc: 600,
      name: 'Peace',
      emotion: 'Bliss',
      view: 'Perfect',
      process: 'Illumination',
      color: '#c026d3',
      levelGroup: 'Power',
      description: 'Peace is the state of spiritual Illumination, Transcendence, and Non-Duality. Mind becomes silent, and reality is experienced as timeless, eternal Being.',
      advice: [
        'Abide in silent meditation and non-dual self-inquiry (\'Who am I?\').',
        'Allow consciousness to rest in its own uncreated, infinite nature.'
      ]
    },
    {
      loc: 700,
      name: 'Enlightenment',
      emotion: 'Ineffable',
      view: 'Is',
      process: 'Pure Consciousness',
      color: '#fbbf24',
      levelGroup: 'Non-Dual',
      description: 'Enlightenment is the ultimate peak of human consciousness, where the individual self merges completely into Divine Consciousness. It represents absolute non-dual Realization.',
      advice: [
        'Surrender all remaining dualistic concepts, subtle self-identifications, and time.',
        'Embody pure Presence, serving as a beacon of transcendent light for all humanity.'
      ]
    }
  ];

  function getHawkinsLevelMetadata(locVal) {
    let num = 500;
    if (typeof locVal === 'number') num = locVal;
    else if (typeof locVal === 'string') {
      const match = locVal.match(/\d+/);
      if (match) num = parseInt(match[0], 10);
    }

    let match = HAWKINS_SCALE[0];
    for (let i = 0; i < HAWKINS_SCALE.length; i++) {
      if (num >= HAWKINS_SCALE[i].loc) {
        match = HAWKINS_SCALE[i];
      }
    }
    return { ...match, locNum: num };
  }

  function createHawkinsRainbowBar(hawkinsLevel) {
    const meta = getHawkinsLevelMetadata(hawkinsLevel);
    const percent = Math.min(Math.max(Math.round((meta.locNum / 1000) * 100), 4), 100);

    return `
      <div class="hawkins-rainbow-container" style="margin-top: 0.6rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--mw-text-muted); margin-bottom: 0.25rem;">
          <span style="font-weight: 700; color: ${meta.color};"><i class="ph ph-lightning"></i> LoC ${meta.locNum} (${meta.name})</span>
          <span style="font-size: 0.68rem; padding: 0.1rem 0.4rem; background: rgba(255,255,255,0.06); border-radius: 10px; color: ${meta.levelGroup === 'Power' ? '#4ade80' : meta.levelGroup === 'Non-Dual' ? '#fbbf24' : '#f87171'};">${meta.levelGroup}</span>
        </div>
        <div class="hawkins-bar-track" style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; position: relative; overflow: hidden;">
          <div class="hawkins-bar-fill" style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #7f1d1d, #dc2626, #ea580c, #16a34a, #0284c7, #7c3aed, #fbbf24); border-radius: 10px; transition: width 0.4s ease;"></div>
        </div>
      </div>
    `;
  }

  function renderHawkinsScaleCard(locVal) {
    const meta = getHawkinsLevelMetadata(locVal);
    
    return `
      <div class="hawkins-scale-card" style="margin-top: 2rem; margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(15, 12, 30, 0.95), rgba(8, 6, 18, 0.95)); border: 1px solid ${meta.color}; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <i class="ph ph-scales" style="font-size: 1.5rem; color: ${meta.color};"></i>
            <div>
              <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #fff;">Hawkins Map of Consciousness Calibration</div>
              <div style="font-size: 0.78rem; color: var(--mw-text-muted);">Calibrated Level of Consciousness (LoC) — Dr. David R. Hawkins, M.D., Ph.D.</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 900; color: ${meta.color};">LoC ${meta.locNum}</span>
            <div style="font-size: 0.75rem; font-weight: 700; color: #cbd5e1;">${meta.name}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.82rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <span style="color: var(--mw-text-muted); display: block; font-size: 0.7rem;">Emotional State</span>
            <strong style="color: #fff;">${meta.emotion}</strong>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <span style="color: var(--mw-text-muted); display: block; font-size: 0.7rem;">Life View</span>
            <strong style="color: #fff;">${meta.view}</strong>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <span style="color: var(--mw-text-muted); display: block; font-size: 0.7rem;">Spiritual Process</span>
            <strong style="color: #fff;">${meta.process}</strong>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <span style="color: var(--mw-text-muted); display: block; font-size: 0.7rem;">Energy Field</span>
            <strong style="color: ${meta.levelGroup === 'Power' || meta.levelGroup === 'Non-Dual' ? '#4ade80' : '#f87171'};">${meta.levelGroup}</strong>
          </div>
        </div>

        ${createHawkinsRainbowBar(meta.locNum)}
      </div>
    `;
  }

  function setupHawkinsGuideInteractive() {
    const container = document.getElementById('hawkinsGuideNodesContainer');
    const inspector = document.getElementById('hawkinsInspectorDetail');
    if (!container) return;

    container.querySelectorAll('.hawkins-node-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = parseInt(btn.getAttribute('data-loc'), 10);
        const meta = getHawkinsLevelMetadata(loc);

        container.querySelectorAll('.hawkins-node-btn').forEach(b => {
          b.style.opacity = '0.7';
          b.style.borderColor = 'rgba(255,255,255,0.15)';
        });
        btn.style.opacity = '1';
        btn.style.borderColor = meta.color;

        if (inspector) {
          inspector.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.45rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 900; color: ${meta.color};">LoC ${meta.loc}</span>
                  <span style="font-family: var(--font-heading); font-size: 0.98rem; font-weight: 700; color: #fff;">${meta.name}</span>
                  <span style="padding: 0.12rem 0.5rem; background: rgba(255,255,255,0.06); border: 1px solid ${meta.color}; color: ${meta.color}; font-weight: 700; font-size: 0.65rem; border-radius: 10px;">${meta.levelGroup} Domain</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--mw-text-muted);">
                  <span>Emotion: <strong style="color: #fff;">${meta.emotion}</strong></span>
                  <span>Perception: <strong style="color: #fff;">${meta.view}</strong></span>
                  <span>Process: <strong style="color: #fff;">${meta.process}</strong></span>
                </div>
              </div>

              <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.45; margin: 0.15rem 0;">
                ${meta.description}
              </p>

              <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.78rem; color: var(--mw-text-muted);">
                <div style="font-weight: 700; color: ${meta.color}; font-size: 0.72rem;">Key Advice &amp; Attunement:</div>
                <ul style="margin: 0; padding-left: 1.1rem; color: #e2e8f0; line-height: 1.35;">
                  ${meta.advice ? meta.advice.map(a => `<li style="margin-bottom: 0.15rem;">${a}</li>`).join('') : ''}
                </ul>
              </div>
            </div>
          `;
        }

        if (typeof window.renderForYouConceptFeed === 'function') {
          if (!window.state) window.state = {};
          window.state.forYouCategory = 'all';
          window.renderForYouConceptFeed();
        }
      });
    });
  }

  window.HawkinsCalculator = {
    HAWKINS_SCALE,
    getHawkinsLevelMetadata,
    createHawkinsRainbowBar,
    renderHawkinsScaleCard,
    setupHawkinsGuideInteractive
  };

  window.createHawkinsRainbowBar = createHawkinsRainbowBar;
  window.renderHawkinsScaleCard = renderHawkinsScaleCard;
  window.setupHawkinsGuideInteractive = setupHawkinsGuideInteractive;

})(window);
