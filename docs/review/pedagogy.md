# Kumquat: pedagogy review

Reviewer lens: teaching quality, learning methodology, sequencing, conceptual connections.
Scope: files 01–13 (Path, Casebook, Rounds, BANK, STEP1, STEP2, designs/biases/tests, Twins, generators, Vault, Concept web, Blueprint/plan, Labs).
Companion files: `web-additions.json`, `misconceptions.json`, `teach-additions.json` (same folder).

---

## 1. Overall verdict

Kumquat is unusually well built. Most question banks are piles of MCQs, but this one has a real instructional design behind it. Bayes is taught with natural frequencies. There is a bathtub model for prevalence and incidence. Every unit opens with a clinical role. The Twins are contrast pairs. The Rounds branch with remediation nodes, and the cases are historical and memorable. The diagnostic-test and absolute-vs-relative strands are as good as anything I have seen for Step 1.

There are five systematic weaknesses:

1. **The inference unit is the weakest unit, and it covers the hardest threshold concept.** That concept is the sampling distribution, which underlies p values and CIs. One step is garbled (L7 S3). The order is abstract-first: CI and p come before SE. The two biggest myths (what p means and what a CI means) are tested only by recognition MCQs. Nowhere are they refuted head-on.
2. **The app never transfers its best insight.** "Sensitivity is not PPV" is taught brilliantly in Unit 3. The same logic explains why p ≠ P(H₀ | data), and the app never makes that bridge. It is the single highest-value connection that is missing.
3. **Causal-structure ideas are thin.** Mediator appears only in an explanation and one bank item. Collider appears only as a distractor (B:68). Regression to the mean appears in one bestiary card, filed under "confounding". Reverse causation is also filed under "confounding". None of these four is taught in a lesson, yet they are exactly what an occupational-health and ER physician meets in real data.
4. **Practice is ~90% recognition.** The app is nearly all 4-option MCQs, plus self-graded teach-back. The only generative formats are Tree drill, Estimate and teach-back. Numeric generators show answer options, so a learner can back-solve or eliminate instead of calculating.
5. **Transfer to real reading is under-trained.** No screen asks the learner to read an abstract cold and produce the bottom line for *their* patient. The Rounds come closest. The checklists in file 13 are good but passive.

One content error contradicts the app's own core message (Round "The screening day", s2/s3b; see §4). Fix it first.

---

## 2. Sequencing

### Unit order
Current order: 1 Math → 2 Measuring disease → 3 Diagnostic tests → 4 Risk → 5 Designs → 6 Bias → 7 Inference → 8 Tests → 9 Appraisal → 10 Trials/QI.

There are two forward-dependency problems:

- **Unit 4 needs Unit 5.** L4 S6 explains RR versus OR by appeal to cohorts and case-control studies ("Cohorts and RCTs follow people forward… Case-control studies pick cases and controls"). Those designs are not taught until Unit 5. L1 S5 also mentions case-control. A novice meets "OR = ad/bc because of the design" before knowing what the design is.
- **Unit 6 needs Unit 7.** L6 S1 sets the order "Could it be chance? Bias? Confounding?", but chance (p, CI, Type I) is taught one unit later. The appraisal sequence works best when chance comes first.

**Recommended order:** 1 Math → 2 Measuring disease → 3 Diagnostic tests → **4 Study designs** → **5 Risk & effect sizes** → **6 Inference & power** → **7 Bias & confounding** → 8 Choosing tests → 9 Appraisal → 10 Trials/QI.

This keeps Diagnostic tests early. That unit is self-contained, high-yield, builds directly on odds from Unit 1, and gives early wins. Designs now produce the measures before the measures are calculated. Chance comes before bias, which matches the appraisal ladder the app itself teaches.

If renumbering is too disruptive, a lighter fix works. Swap Units 4 and 5 only, and add one "chance" preview step to the start of Unit 6 (rewrite in §5, *lesson 6 step 1*).

### Order of steps inside Unit 7
Current order: abstract → H₀/p → CI → errors → power → SD vs SE → significance vs importance → correlation. The concrete idea (sampling variation, SE) arrives **after** the abstract ideas built on it (CI, p). Concrete-to-abstract says reverse this:

1. Abstract (hook)
2. SD vs SE, with the CI dance lab ("means wobble from sample to sample")
3. CI (rewrite)
4. H₀ and p (rewrite)
5. **New:** p value vs PPV (the bridge)
6. Type I/II errors
7. Power
8. **New:** multiple comparisons
9. Significant vs important
10. Answer the registrar

Move correlation (S8) to Unit 8, where Pearson/Spearman, kappa and Bland–Altman already sit. This also places "correlation is not agreement" next to the agreement statistics.

### 30-day plan
- **Day 14 is overloaded.** It has Lesson 10, two cases, a drill and a 40-question mock. A mock on a new-lesson day measures fatigue, not learning. Move the mock to Day 15.
- **Days 15–29 always show "Drill your 2 weakest: Diagnostic tests, Risk & effect sizes".** That looks like a static default, not a computed weakness. If it is computed, the plan should still say "computed on the day". If it is hard-coded, it biases practice toward the two strongest-taught units and starves Bias and Inference.
- **No lesson is ever revisited.** Leitner spaces *items*, not the explanatory frame. Add a 3-minute "Takeaways recall" at +3 and +10 days for each lesson (see Improvement 13).
- **Choosing tests and Trials/QI appear only twice after their lesson day** (Days 26 and 24/26). Fold them into the daily drill mix at a low weight, so the interleaving is real.

---

## 3. Where a novice gets lost

| Where | Problem |
|---|---|
| L1 S1, L2 S7, L5 S1, L8 S3, L10 S6 | Rendering bug: a missing paragraph break runs two sentences together ("worker-years.Name", "age mix.Canteen", "injuries?Each", "else?Continuous", "fairly.Equipoise"). |
| L1 S1 | "Rate: events per unit of time". Learners will then meet "attack rate", "case-fatality rate" and "prevalence rate", which are not rates. Say so, or they will think the definition is wrong. |
| L2 S7 | The question asks for a **relative risk**, which Unit 4 has not defined yet. SMR is crammed into one bullet with "reference rates for your population's age mix", and standardisation is never explained. |
| L3 S8 | LR arrives as a bare formula. The tree from S2 already contains it: 90 TP / 90 FP among diseased vs healthy gives 90%/10% = 9. Show that. ROC/AUC is in the core points, the blueprint and the bank, but is never taught in a lesson step. |
| L4 S3 | **CER and EER are never defined.** They then appear in every generator and in the Vault. |
| L4 S6 | "Rare outcome (under ~10%)" will be misapplied. In the case-control example, cases are 33% of the sample. Learners need to hear that rarity is judged in the *source population*. |
| L4 S8 | Cox model and "people drop out" (censoring) appear before KM/censoring is taught (Unit 8, and only in the bank). |
| L5 S5 | "Randomisation balances known and unknown confounders" leaves out "on average". Small trials can be unlucky. |
| L5 S6 | "Beware the ecological fallacy" is never defined in the lesson. |
| L5 S8 | The timeline illustration data looks truncated in the export (`["Case-]`). Check that it renders. |
| L6 S3 | The question's correct answer, "Hawthorne effect (plus self-report bias)", is a compound option that gives itself away. It is also arguably wrong: the threat is to the *outcome measurement* (self-report by people who know the hypothesis), which is information bias. Hawthorne is a change in true behaviour. The distractor "Neyman bias" is never taught in the lesson. |
| L6 S4 | Mediator is introduced only inside an explanation. There is no step and no diagram. |
| L6 (whole) | Regression to the mean, reverse causation, collider/Berkson, differential vs non-differential misclassification and overdiagnosis are all in the blueprint but not in the lesson. |
| L7 S3 | "It excludes 0, matching p method's long-run hit rate" is garbled. |
| L7 S8 | "Variance" is undefined, yet r² is "variance explained". |
| L8 S2 | "Parametric" is used without definition. |
| L9 S2 | RAMMbo is an illustration only. The acronym is never spelled out in text, so it fails without the image (screen readers, slow devices). |
| L9 S6 | I² is defined, but the forest plot is described in words only. The Forest plot reader lab exists; link it inline, as other steps do. |
| L10 | Efficacy vs effectiveness belongs to appraisal/applicability (Unit 9). Its Twin is tagged [appraise] already. |

---

## 4. Content errors and inconsistencies (fix before adding anything)

1. **Round "The screening day", s2 and s3b. This is a conceptual error that contradicts Unit 3.**
   - s2 claims the single-reading screen has "high sensitivity… rarely misses true hypertensives". Only the 300 screen-positives were re-measured, so sensitivity *cannot be estimated*. That is verification bias, which the app teaches in L3 S9.
   - s3b says "PPV 40% with prevalence ~6% … so specificity can't be high at this prevalence". If the 1,700 screen-negatives are truly normotensive, specificity = (1,880 − 180)/1,880 = **90%**. That is good specificity. The low PPV comes from the **low prevalence**, which is exactly the lesson the app exists to teach.
   - The repeat reading being normal in 180 of 300 people is largely **regression to the mean**. This is a perfect, missed teaching moment.
   - Rewrite (replace s2, s3b):
     - **s2 Q:** "Of the 300 flagged, 180 are normal on the nurse's repeat reading a week later; 120 are confirmed. Nobody re-measured the 1,700 who screened negative. What can you say about the one-off screen?"
       - [BEST] "PPV was 120/300 = 40%. Sensitivity can't be estimated, because screen-negatives were never re-measured (verification bias)." → s3 :: "Right. You only verified the positives. And many 'false positives' are regression to the mean: people picked for one high reading tend to read lower next time."
       - [wrong] "High sensitivity, modest specificity" → s3b :: "Sensitivity needs the true hypertensives among the screen-negatives, and you never looked."
     - **s3b:** "Your OM consultant asks how you know the screen misses few cases. Correct it:" [BEST] "I don't. To estimate sensitivity I'd need a repeat reading in a random sample of screen-negatives. If they're all truly normal, specificity is about 90%, and the 40% PPV is mostly due to low prevalence." → s3.
     - In **s3**, change "Confirmed prevalence is 120/2000 = 6%" to "Confirmed prevalence is at least 120/2000 = 6% (more if the screen missed anyone)." Make the matching change in s4: "Among the 1,880 workers not confirmed hypertensive…".
2. **Twins, Equivalence vs Non-inferiority.** "CI −1.5 to +3.5 against a margin of −3: shown" uses the same numbers as S2:20, where the conclusion is *non-inferiority not shown*. The two items use opposite sign conventions without saying so, which is guaranteed confusion. Replace the cue with: "Difference new − standard in mmHg reduction (higher = better) is −1.0 (95% CI −2.5 to +0.5), margin −3: shown → Non-inferiority". In S2:20, state the direction explicitly: "(positive = new drug lowers BP less)".
3. **BIASES reference categories.** Regression to the mean is filed [confounding]. It is a statistical artefact of measurement variability plus selection on extreme values. Reverse causation is also filed [confounding]; it is an error about causal direction. Re-tag RTM as [measurement] and reverse causation as [causal direction], or put both in a new "artefacts and causal direction" group. Learners build their mental categories from these tags.
4. **Ambiguous bias items (a parent category used as a distractor).** In X:1 (Healthy worker effect), "Selection bias" is a distractor, but HWE *is* a selection bias. X:3 (Berkson's, distractor "Selection bias") and X:15 (Confounding by indication, distractor "Confounding") have the same problem. A careful learner is punished for being right. Swap those distractors for siblings: X:1 → "Attrition bias"; X:3 → "Spectrum bias"; X:15 → "Reverse causation" (it is already a distractor there, so add "Recall bias" in its place). The other fix is a rule shown in the stem: "Choose the most specific answer."
5. **Round "Resin rash", s4.** "8 of 9 cases in the 20 without barrier cream vs 1 of 40 with it" is labelled "dose-response". It is really a comparison of a protective factor across two levels of exposure intensity. A gradient needs three or more ordered levels. Either add a third level (e.g. "brush application, gloves only: 3 of 20") or relabel the answer "exposure intensity / effect of protection, consistent with a biological gradient".
6. **Twins heading duplicated.** "Sensitivity vs PPV" appears twice. The second is about series/parallel testing; rename it "Series vs parallel: what moves".

---

## 5. Lesson rewrites (exact new text)

**lesson 1 step 1**
> Almost every number in epidemiology is one of three things:
> - **Proportion**: a part of a whole, between 0 and 1. 30 hypertensive workers out of 200 = 15%.
> - **Ratio**: one quantity divided by another. Risk in smokers ÷ risk in non-smokers.
> - **Rate**: events per unit of person-time. 4 injuries per 1,000 worker-years.
>
> Name which one you're looking at and half the formulas write themselves. Warning: medicine misuses "rate". "Attack rate", "case-fatality rate" and "prevalence rate" are really proportions. Ask what's in the denominator: people, or people × time?

**lesson 2 step 7**
> - **Attack rate**: cases ÷ people exposed, over a short outbreak. It's a proportion, not a true rate.
> - **Relative risk (RR)**: one group's attack rate ÷ the other's. RR 1 means no difference; you'll meet RR properly in Unit 4.
> - **Case-fatality rate**: deaths ÷ cases. It measures severity, not burden.
>
> Canteen lunch: 120 ate the chicken and 48 got sick; 80 skipped it and 4 got sick.
> *(Question unchanged.)*
>
> Add a separate step **2.7b, "Fair comparisons of deaths"**: "An older workforce has more deaths even if its jobs are safe. Standardisation removes the age effect. The SMR compares your observed deaths with the number you'd expect if your workers died at national age-specific rates. SMR 1.4 = 40% more deaths than expected for your age mix." Then use the existing bank item B:38.

**lesson 3 step 8**
> Look back at the tree. The positive result came from 90% of the diseased (true positives) and from 10% of the healthy (false positives). The ratio of those two, 90% ÷ 10% = 9, is the **positive likelihood ratio**: how many times more likely this result is in someone with the disease than without.
> LR+ = sens ÷ (1 − spec) · LR− = (1 − sens) ÷ spec
> To use it, work in odds (Unit 1): post-test odds = pre-test odds × LR. LRs above 10 or below 0.1 shift probability a lot; an LR of 1 changes nothing. Unlike PPV, an LR belongs to the test, so you can carry it to a new population.
> *(Question unchanged.)*
>
> Add **step 8b (ROC)**: "Every cut-off gives one (sensitivity, 1 − specificity) pair. Plot them all and you get the ROC curve. The area under it (AUC) is the chance the test ranks a random diseased person above a random healthy one: 0.5 is a coin toss, 1.0 is perfect. Moving the cut-off moves you *along* the curve; a better test moves the whole curve up-left." Reuse the `curves` illustration with an ROC inset, or link the Cut-off dial.

**lesson 4 step 3**
> Two event rates come out of every trial:
> - **CER** (control event rate): the risk in the control group, 6%.
> - **EER** (experimental event rate): the risk in the treated group, 4%.
>
> From them:
> - RR = EER ÷ CER = 4% ÷ 6% = 0.67
> - RRR = 1 − RR = 33% (the headline)
> - ARR = CER − EER = 6% − 4% = 2 percentage points
> - NNT = 1 ÷ ARR = 1 ÷ 0.02 = 50, over the trial's time frame (here 10 years). An NNT without a time frame is meaningless.

**lesson 4 step 6**
> Cohorts and RCTs follow people forward, so they measure risk: RR = [a/(a+b)] ÷ [c/(c+d)].
> Case-control studies choose how many cases and controls to enrol, so the proportion with the outcome in the study is artificial. Only odds survive: OR = ad ÷ bc.
> When the outcome is **rare in the population the cases came from** (under ~10%), OR ≈ RR. That holds even if half your study sample are cases. When the outcome is common, the OR exaggerates: an OR of 3 can correspond to an RR under 2.
> *(Question unchanged.)*

**lesson 4 step 8**
> In long trials, people join at different times, leave or are still event-free when the study ends. Their follow-up is **censored**: we know they were event-free up to a point, but not what happened after. Survival methods use that partial information instead of throwing it away.
> The **hazard ratio** (HR, from a Cox model) compares event rates at each moment, assuming that ratio stays roughly constant over time. HR 0.75 = a 25% lower event rate at any given time. It is still relative: ask for the absolute numbers, e.g. events per 1,000 person-years in each arm.

**lesson 5 step 5**
> In an RCT the investigator randomly allocates the intervention. Randomisation balances known and unknown confounders **on average**. In a big trial that average is reliable; in a trial of 30 people, chance imbalance is common, which is why baseline tables still matter. No other design handles unmeasured confounders at all.
> Variants: crossover (each person gets both), cluster (randomise sites, not people), non-inferiority (prove "not worse by more than a margin").

**lesson 5 step 6**
> **Ecological** studies compare groups (countries, sites), not people. Their trap is the **ecological fallacy**: assuming a group-level link holds for individuals. Countries that eat more salt have more strokes; that doesn't show the stroke patients were the salt-eaters.
> **Case series**: describes patients, with no comparison group. Good for raising alarms (thalidomide, early HIV); can't test causation.

**lesson 6 step 1** (only if Inference is not moved before Bias)
> "Workers who use the site gym take 50% fewer sick days. We should make the gym mandatory!"
> Before believing any association, work down the ladder:
> 1. **Chance**: could random sampling noise explain it? (Unit 7 gives the tools: p values and CIs. For now: small numbers, wide uncertainty.)
> 2. **Bias**: did the way people were chosen or measured create it?
> 3. **Confounding**: does a third factor drive both?
> 4. **Reverse causation**: could the outcome have caused the exposure?
> Only then consider causation.

**lesson 6 step 3** (replace the question)
> Q: Sick days in her study were self-reported, and gym users knew the study was about the gym. Which problem most threatens the result?
> Options (first = correct): Information bias: self-reported outcomes from people who know the hypothesis (differential misclassification) | Lead-time bias | Berkson's bias | Regression to the mean
> Explanation: The outcome is being *measured* differently in the two groups. Gym users may under-report sick days to fit the story. Fix: use HR absence records. (If gym users genuinely changed their behaviour because they were watched, that would be a Hawthorne effect, a different problem.)

**lesson 6 step 4b (new): "Three kinds of third variable"**
> A third variable can sit in three places, and each needs opposite handling:
> - **Confounder**: causes both exposure and outcome (age → gym use, age → sick days). *Adjust for it.*
> - **Mediator**: caused by the exposure, and causes the outcome (gym → fitness → fewer sick days). *Don't adjust* if you want the total effect; you'd remove the very benefit you're measuring.
> - **Collider**: caused by both exposure and outcome. *Don't adjust or restrict on it*, or you create an association that isn't there.
>
> Example: admission to hospital is caused both by smoking-related disease and by a rare lung condition. In the general population the two are unrelated, but among inpatients they look negatively linked. This is Berkson's bias, a collider in action.
> [illustration: conf variants: arrows into C (confounder), through M (mediator), out to K (collider)]
> Q: In a study of a statin and MI, the analyst adjusts for LDL measured after starting treatment. LDL here is a…
> Options (first = correct): Mediator; adjusting hides part of the statin's effect | Confounder; adjusting removes bias | Collider; adjusting is required | Effect modifier; report strata
> Explanation: The statin lowers LDL, and lower LDL reduces MI: LDL is on the pathway.

**lesson 6 step 7b (new): "Regression to the mean"**
> Pick people *because* a measurement was extreme, such as one BP reading of 165, and measure again. On average they'll come out lower, with no treatment at all. Any single reading is truth plus noise, and those picked for a high reading were, on average, also unlucky with the noise.
> That's why your screening day's "false positives" melt on repeat, and why uncontrolled before–after studies of people recruited for high values always look like success.
> Fixes: average two or more baseline readings, and always have a control group, which regresses by the same amount.
> Q: Workers enrolled for a single BP ≥ 160 attend a lifestyle course; mean BP falls 12 mmHg with no control group. The most important alternative explanation is…
> Options (first = correct): Regression to the mean | Lead-time bias | Confounding by age | Type II error

**lesson 6 step 7** (append to the existing text)
> The extreme form of length-time bias is **overdiagnosis**: finding "disease" that would never have caused symptoms or death. Its signature is a rise in incidence with no fall in mortality. And because most people screened don't have the disease, the **number needed to screen** to prevent one death is far larger than an NNT.

**lesson 7 step 2**
> Statistics starts by assuming the **null hypothesis** H₀: no real difference. The p value answers one narrow question: *if H₀ were true, how often would we see a difference at least this large, just from sampling noise?*
> p = 0.04 → if the drug did nothing, results this extreme would turn up in about 4% of trials like this one.
> What it is **not**: the probability that H₀ is true, the probability the drug works, or a measure of how big the effect is. A tiny effect in a huge trial can have p < 0.001.
> *(Question unchanged.)*

**lesson 7 step 3** (replaces the garbled text)
> The 95% CI (0.3 to 9.7 mmHg) is the range of true effects that are reasonably compatible with these data. The "95%" describes the **method**: if the trial were repeated many times, 95% of the intervals built this way would contain the true effect. It is **not** the range where 95% of patients' BP changes fall (that would use the SD), and it doesn't promise that a repeat trial will land inside it.
> Because this interval excludes 0, p < 0.05. The CI and the p value come from the same calculation, but the CI also tells you the size and the precision.
> *(Question unchanged.)*

**lesson 7 step 3b (new): "p values and PPV are the same trap"**
> Remember the rapid cardiac test with a 50% PPV? Research has the same problem.
> Imagine 1,000 hypotheses tested in trials, of which 100 (10%) are truly effective. With 80% power the trials catch 80 of them. With α = 0.05, 45 of the 900 duds also come up "significant".
> [illustration: tree {"prev":0.1,"sens":0.8,"spec":0.95,"cap":"Hypotheses, not patients: prior plausibility 10%, power 80%, α 5%"}]
> So 45 of the 125 significant findings (36%) are false alarms. Power is the study's sensitivity, α is its false-positive rate, and prior plausibility is its prevalence. A p value is like sensitivity read backwards: P(data | H₀) is not P(H₀ | data).
> Q: An implausible hypothesis (prior 2%) is tested with 80% power at α 0.05 and comes back p < 0.05. Roughly what proportion of such "significant" findings are true?
> Options (first = correct): About 25% | About 95% | About 80% | About 5%
> Explanation: Per 1,000: 20 true → 16 detected; 980 false → 49 false alarms. 16 ÷ 65 ≈ 25%.

**lesson 7 step 8b (new): "Twenty lottery tickets"**
> Each test at α = 0.05 is a 1-in-20 chance of a false alarm. Test 20 outcomes or 12 subgroups and you expect about one "significant" result from noise alone. Trust a result more when it was the pre-specified primary outcome. Treat unplanned subgroups as questions, not answers. Bonferroni divides α by the number of tests.
> One more trap: "significant in women, not in men" does **not** show the effect differs by sex. Only a test of the *difference between* subgroups (an interaction test) can show that.
> Q: (Use misconception `subgroup-interaction` from `misconceptions.json`.)

**lesson 9 step 2**
> A quick validity scan for any trial, **RAMMbo**:
> - **R**ecruitment: who was studied, and are they like my patients?
> - **A**llocation: randomised, concealed, groups similar at baseline?
> - **M**aintenance: treated equally apart from the intervention, and followed up (over 80%)?
> - **M**easurement: **b**linded assessors, or **o**bjective outcomes?
> [illustration: rammbo {}]

---

## 6. Misconceptions: coverage audit

| Misconception | Current treatment | Gap |
|---|---|---|
| p = P(H₀) | B:4, L7 S2 MCQ | Recognition only. No refutation text, no link to PPV. |
| p > 0.05 = no effect | Power teach-back, S2:17 | Not in lesson text. |
| Smaller p = bigger effect | Absent | Add (`p-effect-size`). |
| CI = 95% of patients / 95% replication | Teach-back rubric only | Not in lesson; garbled step. |
| Overlapping CIs = NS | Absent | Add. |
| OR = "times as likely" when outcome common | Twin, B:19 | No worked contrast (OR 3 vs RR 1.8). |
| "Rare" judged in the sample | Absent | Add. |
| RTM | X:17 only, wrong category | Add lesson step and probe. |
| Confounder vs collider | Absent (collider only as distractor) | Add lesson step, node and probe. |
| Adjust for everything | Absent | Add (mediator probe). |
| Big n fixes bias | Implicit in HRT case | Add explicit probe. |
| Randomisation guarantees balance | Absent | Add. |
| Per-protocol is "truer" | Partly (L9 S4) | Add counselling framing. |
| Base-rate neglect | Excellent | Add an OH drug-screen variant for transfer. |
| Absolute vs relative | Excellent | Add NNT time-frame and scale-dependence of effect modification. |
| "No significant difference" = equivalent | S2:20 only (NI) | Add a superiority-trial probe. |
| Accuracy is a good summary | Vault note only | Add accuracy paradox. |
| Surrogate improvement = patient benefit | B:66, core points | Add a CAST-style probe. |
| % agreement = reliability | B:10 | Add a kappa probe with high prevalence. |
| Significant in one subgroup = effect modification | Partly (RECOVERY) | Add interaction probe. |

All 22 are written as probes in `misconceptions.json`. Use them as a **pre-lesson diagnostic**: ask before teaching, then refute. A wrong prediction followed by an explicit "you may think X; actually Y, because Z" is the refutation-text format with the strongest evidence for conceptual change.

---

## 7. Concept web: missing connections (summary)

The web is strong *within* topics and weak *between* them. Three bridges are missing:

- **Diagnostic-test logic ↔ hypothesis testing**: power ↔ sensitivity, α ↔ 1 − specificity, prior plausibility ↔ prevalence, p ↔ PPV (the transposed conditional).
- **Causal structure**: confounder / mediator / collider / selection bias / surrogate; reverse causation ↔ cross-sectional design; Bradford Hill ↔ temporality ↔ cohort.
- **Applicability**: external validity ↔ baseline risk ↔ NNT; ↔ PPV at a new prevalence.

Three edges have empty labels (spec—lr, sens—roc, spec—roc). Fill them in, or better, make them **learner-labelled** (Improvement 12). The 12 new nodes and 30 edges are in `web-additions.json`.

---

## 8. Ranked improvements (20)

Each item names the screen or data structure it changes. All fit a single-file HTML app.

1. **Fix the screening-day Round (s2, s3, s3b, s4).** *Data: ROUNDS["The screening day"].* It currently teaches the opposite of Unit 3, and it misses the RTM and verification-bias lessons sitting in its own numbers. The exact rewrite is in §4.1.

2. **Rebuild Lesson 7 (Inference): reorder steps, rewrite S2/S3, add the p-vs-PPV bridge and multiple comparisons.** *Data: LESSONS[7].steps.* Order: SE → CI → p → p-vs-PPV → errors → power → multiplicity → importance. The bridge step reuses the existing `tree` illustration with a hypotheses caption, so no new component is needed. This is the highest-leverage conceptual addition in the app. Text is in §5.

3. **Add a "Myth check" pre-question to each lesson, and a Myth deck mode.** *Screens: lesson start and Quiz modes; data: new MYTHS array from `misconceptions.json`.*
   - Before step 1, show one or two probes for that unit and record the answer with the calibration toggle.
   - After the relevant step, re-show the probe with refutation text: "Many people think {myth}. Actually {truth}."
   - Feed misses into Leitner box 1.
   - Add `myth` as a quiz mode and as a pool in the topic mix (`M:topic`).

4. **Add the causal-structure steps to Lesson 6: confounder vs mediator vs collider, RTM, reverse causation, overdiagnosis/NNS.** *Data: LESSONS[6].steps.* Extend the `conf` illustration with a `kind` param (confounder / mediator / collider) that draws the arrow direction. Text is in §5.

5. **Make numeric practice generative: type the answer before you see options.** *Screen: quiz card; data: generator output.*
   - For g:gen* items in Daily/Blitz/Retry, show a numeric input first, with ±2% or ±1 NNT tolerance.
   - Reveal options only after the learner clicks "show options" (scored lower) or answers.
   - Recall-to-recognition fallback keeps it beginner-friendly. It also kills back-solving and distractor elimination.

6. **Reorder the Path: swap Units 4 and 5, and move Inference before Bias.** *Data: PATH order and PLAN days 5–10.* If renumbering is too costly, do the swap only and add the L6 S1 "chance" preview rewrite.

7. **Fix the factual and labelling inconsistencies in §4.2–4.6.** *Data: TWINS (equivalence/NI cue, duplicate heading), BIASES categories (RTM, reverse causation), X:1/X:3/X:15 distractors, Round "Resin rash" s4.*

8. **Define every term at first use, with a tap-to-define glossary chip.** *Screen: lesson renderer; data: GLOSSARY map keyed by term.* Priority terms: CER, EER, censoring, Cox, standardisation, ecological fallacy, variance, parametric, RAMMbo, H₀, α, β. Auto-link the first occurrence per lesson. It is cheap and removes most "lost novice" moments. Also fix the five run-on paragraph breaks.

9. **Add an "Abstract X-ray" lab for transfer.** *Screen: Labs; data: new ABSTRACTS array (8–10 fictional but realistic abstracts in ER/OH/FM settings).* The learner fills fields in order:
   - PICO
   - design
   - measure with its CI
   - significant? (y/n)
   - "for my patient with baseline risk X%, NNT = ___"
   - one-line bottom line (free text)
   - spin spotted (multi-select: relative only, subgroup, surrogate, composite, early stop, per-protocol)

   Show a model answer after each field. This is the far-transfer task the app lacks.

10. **Teach-back 2.0: model answer, keyword nudge, audience switch.** *Screen: Teach-back.*
    - After the learner writes, show a model explanation, then the rubric for self-grading. Comparing against an exemplar reduces the overconfidence that pure self-grading produces.
    - Add a simple keyword check (e.g. "prevalence", "false positive" for [ppv]) that prompts "Did you mention…?".
    - Add the 11 new prompts from `teach-additions.json`.

11. **Hypercorrection queue in the calibration system.** *Data: retry mode ordering; screen: Stats.* Errors made with high confidence (calibration toggle *off*) go to the front of Retry and come back the next day. High-confidence errors are the ones most likely to be corrected durably, if they are revisited. Also plot accuracy vs confidence on the stats screen (a two-bar calibration chart).

12. **Generative concept-web practice: "Name the link".** *Screen: Concept web; data: WEB.edges.*
    - Daily, show two connected nodes with the label hidden. The learner types or chooses the relationship, then sees the label.
    - Fill the three empty labels: spec—lr "LR+ denominator: 1 − spec"; sens—roc "y-axis"; spec—roc "x-axis is 1 − spec".
    - Prioritise cross-topic edges from `web-additions.json`. This is elaboration plus retrieval on the connections themselves.

13. **Spaced "Takeaways recall" for each lesson.** *Screens: Today/Round composer; data: PLAN.* At +3 and +10 days after a lesson, show the takeaways as cloze blanks, e.g. "Same RRR, lower baseline risk → ____ NNT". Free recall of the frame protects the schema, not just the items.

14. **Problem-type identification before solving (discrimination training).** *Screen: Daily drill and Blitz.* For roughly one item in three in mixed drills, first ask "What is being asked?" (sensitivity / PPV / RR / OR / NNT / incidence / AF…), then reveal the stem's numbers. Interleaving only helps if learners have to *choose* the strategy; currently the item title (e.g. "What is the PPV?") gives the strategy away.

15. **Complete Lesson 3 with LR-from-the-tree and an ROC step.** *Data: LESSONS[3].steps.* Text is in §5. ROC is blueprint-listed and bank-tested but never taught.

16. **Proper fading for worked examples.** *Screen: hint system.* Replace the single "formula-only hint" with three levels:
    1. Full worked example with the item's own numbers.
    2. Completion problem, with the first line done (e.g. "pre-odds = 0.25 × LR = ___").
    3. Formula only.

    Fade automatically: after two correct answers at a level, drop to the next. Restore the fuller level after an error on that generator.

17. **"Your clinic" calculator, run on the learner's own numbers.** *Screen: Labs (extend the 2×2 Lab and Risk Lab).* Add an "enter my numbers" panel, e.g. "My screening day: 2,000 workers, 300 flagged, 120 confirmed". It returns PPV, what can't be estimated, and the implied specificity. Using personally meaningful data is a strong transfer bridge for a practising GP.

18. **Make the plan adaptive and de-load Day 14.** *Data: PLAN builder.* Move the Day 14 mock to Day 15. Compute "weakest" from the last 7 days' accuracy with a minimum item count; show "(computed today)" so it isn't the static "Diagnostic tests, Risk" every day. Keep Choosing tests and Trials/QI in the daily mix at low weight.

19. **Casebook "what if" counterfactual questions.** *Data: CASES.* Add one question per case that changes a single feature and asks for the consequence. Examples:
    - HRT: "If WHI had been a cohort of 16,600 women instead of a trial, what would you have expected?"
    - Snow: "If customers had chosen their water company by price?"
    - RECOVERY: "If the subgroup had been post-hoc, one of 20?"

    Counterfactual variation is how a case becomes a transferable principle rather than a story.

20. **Move correlation to Unit 8, and efficacy vs effectiveness to Unit 9.** *Data: LESSONS[7] S8 → LESSONS[8]; LESSONS[10] S7 → LESSONS[9] after Applicability.* Each idea then sits next to its natural contrast: correlation vs agreement (kappa/Bland–Altman), and efficacy vs effectiveness vs applicability.

---

## 9. Notes on methodology already in place

- **Natural frequencies, the bathtub and icon arrays** are well chosen dual-coding devices. Keep them, and reuse the tree for p values (Improvement 2).
- **Twins** are excellent contrast sets. To make them generative, add a mode where the learner writes the "Tell" (the discriminating rule) before seeing it.
- **Branching Rounds** with remediation nodes are effectively error-driven learning. Every wrong branch forces an explicit correction, which is good. Extend the pattern to Casebook cases, which are currently linear.
- **Error autopsy** should feed the Myth deck. If the learner tags a miss "I confused the direction of the conditional", queue the p/PPV and sens/PPV myths.
- **Teach-back** is the only free-production format. It needs an exemplar to calibrate against (Improvement 10), or it mostly measures confidence.
