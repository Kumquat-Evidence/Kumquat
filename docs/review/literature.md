# Kumquat: can it make a reader of real papers? Gap report

Reviewer lens: a practising GP who wants to read current clinical literature with full understanding, not only pass Step 1.
Source: the content export in `review/01–13` (lessons, casebook, rounds, question bank, vignettes, designs/biases/tests, twins, generators, vault, concept web, blueprint, checklists). Each status below is based on what the export actually says, not on the self-rated blueprint.

**Status key.** Covered = taught with explanation and practised. Partly = named, or one item or definition, with no practice reading it in a paper. Missing = absent.

## Summary

Kumquat teaches the arithmetic of evidence very well: 2×2 tables, RR/OR/ARR/NNT, LRs and Bayes, CIs, p-values, power, confounding, and the classic biases. It also covers ITT, forest and funnel plots, GRADE and design choice. The casebook (RECOVERY, HRT, Doll–Hill) is a strong bridge to real papers.

The gap is the layer between "I know what an HR is" and "I can read Table 3 of a NEJM paper". Users never see a real-looking results table, regression output, KM figure with numbers at risk, or a full abstract to take apart. Modern observational methods are absent (propensity scores, IV, DiD, ITS beyond a mention), and so are Bayesian results, prediction-model metrics (calibration, C-statistic), meta-analysis models and prediction intervals, and every reporting guideline. Most "partly" items are a single definition or one MCQ.

## Gap table

| # | Reading skill | Status | What exists now | What's missing |
|---|---|---|---|---|
| 1 | Reading Table 1 and baseline imbalance | Partly | Checklist line "groups similar at baseline?"; baseline risk used for NNT | No Table 1 to read; nothing on why p-values in RCT Table 1 are meaningless; nothing on SMDs or which imbalances are prognostically important |
| 2 | CONSORT flow diagram | Missing | — | Randomised vs analysed, differential dropout, reading exclusions |
| 3 | Primary vs secondary outcomes, outcome switching, registration | Partly | One bank item; journal-club round touches it | Registry comparison, hierarchy of outcomes, "trial answer = primary outcome" |
| 4 | Crude vs adjusted estimates | Partly | Stratification / Mantel–Haenszel lab; "crude" in standardisation | Reading model 1/2/3 columns; what a shrinking estimate tells you; residual confounding |
| 5 | Regression output (β, OR per unit, CI, interaction terms) | Missing (as reading) | Test-picker says when to use linear, logistic or Cox regression; factorial "watch for interaction" | Interpreting β and exp(β), per-unit and per-SD scaling, multiplying ORs, main effects changing meaning with an interaction term, reference categories |
| 6 | Kaplan–Meier curves and numbers at risk | Partly | Test choice; one item on median survival; censoring definition | Reading a KM figure, absolute gap at a time point, tails, numbers-at-risk table, crossing curves |
| 7 | Cox HR and proportional hazards | Partly | HR lesson step (good); PH assumption named in test picker | Checking PH (Schoenfeld, crossing curves), RMST as alternative, HR ≠ risk ratio over time |
| 8 | Competing risks | Missing | — | Fine–Gray, cumulative incidence vs 1 − KM, death as competing event (important in older/CKD populations) |
| 9 | Absolute vs relative effects in abstracts | Covered | Risk Lab, Unit 4, HRT case, statin round, generators | Could add the habit of hunting the absolute numbers in the results table when the abstract gives only HR |
| 10 | Composite outcomes | Partly | One bank item, one vignette | Reading component-level tables; weighting of components |
| 11 | Non-inferiority margins | Covered (concept) / Partly (reading) | Twins, bank items, NI CI vs margin item, ITT-vs-PP item | Margin justification, both-populations rule, NI spin in abstracts; no full NI paper |
| 12 | Subgroups and multiplicity | Partly | Sepsis-bundle scenario (12 subgroups), RECOVERY credibility, Bonferroni formula | Interaction test vs within-subgroup p, credibility criteria (ICEMAN), forest-plot-of-subgroups reading |
| 13 | Spin in abstracts | Partly | "spin" in Risk Lab (relative vs absolute only) | Spin patterns: "trend", secondary/subgroup emphasis, non-significant NI claims, causal language in observational studies |
| 14 | Sensitivity analyses | Partly | Named as a fix for attrition | Purpose, reading them (e.g. excluding high RoB, MI vs complete case), what agreement does and doesn't prove |
| 15 | Missing data handling | Partly | One mention | Complete case vs multiple imputation, MAR, worst-case analyses |
| 16 | Propensity scores (matching, IPW) | Missing | — | Confounding by indication, balance (SMD), overlap, unmeasured confounding |
| 17 | Instrumental variables / Mendelian randomisation | Missing | — | Assumptions and failure modes |
| 18 | Difference-in-differences | Missing | — | Parallel trends; common in health policy papers |
| 19 | Interrupted time series | Partly | Named as an option in one vignette | Level vs slope, counterfactual trend, autocorrelation, co-interventions; ties naturally to the QI unit |
| 20 | Other observational biases in modern papers (immortal time, collider, E-value, DAGs, target trial emulation) | Partly | Collider appears once as a distractor; healthy worker effect covered | Immortal time bias (very common in drug registry studies), E-values, DAG reading, target trial framing |
| 21 | Diagnostic accuracy reporting (STARD, AUC, spectrum, indeterminates) | Covered (core) / Partly (reporting) | Unit 3 is excellent; ROC/AUC; spectrum and verification bias; LR nomogram | Two-gate vs consecutive designs, indeterminate results, CIs on sens/spec, reading a STARD flow |
| 22 | C-statistic and calibration | Missing (calibration) / Partly (AUC as discrimination) | AUC for tests | Calibration plots, slope/intercept, discrimination vs calibration distinction |
| 23 | Prediction models (development, validation, TRIPOD, overfitting) | Missing | One "risk score" mention | Events per variable, internal vs external validation, decision curves; directly relevant to QRISK/HEART/Wells use |
| 24 | Meta-analysis: fixed vs random effects | Missing | Forest plot reader; diamond | Model choice, weighting differences, why RE > FE signals small-study effects |
| 25 | I², τ² and prediction intervals | Partly (I² only) | I² defined and used in rounds | I² is not size of heterogeneity; τ²; prediction intervals |
| 26 | Funnel plots and small-study effects | Covered | Funnel lab with publication bias toggle | Egger, trim-and-fill, other causes of asymmetry |
| 27 | GRADE | Covered (basic) | Levels, starting points | Applying the five downgrade domains to a summary-of-findings table |
| 28 | Bayesian results (credible intervals, posterior probability, priors) | Missing | Bayes only for diagnostic tests | Reading "posterior probability of benefit 94%", CrI vs CI, sceptical priors; now common in ICU/COVID/platform trials |
| 29 | Fragility index | Missing | — | Calculation and limits |
| 30 | Reporting guidelines (CONSORT, STROBE, STARD, PRISMA, TRIPOD) | Missing | Appraisal checklists (RCT, cohort, case-control, diagnostic, SR) are CASP-style and good | Naming and using the guidelines; knowing reporting ≠ quality |
| 31 | Cluster trials (ICC, design effect) | Partly | Cluster design described | ICC, design effect, unit-of-analysis error |
| 32 | Early stopping | Partly | One bank item | Number of events at stopping, overestimation |
| 33 | Cross-sectional regression: prevalence ratio vs OR for common outcomes | Partly | OR ≈ RR only when rare | PR from Poisson/log-binomial; OR inflation shown with numbers |
| 34 | Effect measures for continuous outcomes (MD, SMD, MCID) | Partly | Statistical vs clinical significance twin | MCID applied to CIs; SMD for pooled scales |

## Top gaps to fix first (impact on reading real papers)

1. **Regression output reading** (#5, #4). Almost every observational paper ends in a table of adjusted ORs or HRs. No skill is taught for reading it.
2. **Survival figures** (#6, #7, #8). KM plots with numbers at risk, PH checks and competing risks appear in most cardiovascular, oncology and renal papers.
3. **Modern causal-inference methods** (#16–20). Propensity scores alone appear in a large share of registry papers. Immortal time bias is the commonest serious flaw a GP reader will meet.
4. **Meta-analysis models** (#24, #25). Without prediction intervals and the RE-vs-FE logic, users over-trust pooled diamonds.
5. **Spin and outcome hierarchy** (#3, #12, #13). This is the practical defence against reading only the abstract.
6. **Prediction models and calibration** (#22, #23). The user's own clinical tools (HEART, Wells, QRISK-style scores) are prediction models.
7. **Bayesian reporting** (#28). Increasingly used in big trials; currently completely absent.
8. **Reporting guidelines** (#30). Cheap to add: a one-screen card per guideline, linked from the existing checklists.

## Proposed content (delivered in this folder)

- `papers.json`: 10 synthetic "Read the paper" exercises (RCT ITT/PP, non-inferiority, Cox cohort with KM, case-control with interaction, two-phase diagnostic accuracy, random-effects MA with prediction interval, cross-sectional PR survey, spin abstract, propensity-matched cohort, ITS). Together they hit gaps #1, 3–8, 11–16, 19, 21, 24–26 and 33. All numbers have been checked in Python (93 assertions).
- `glossary.json`: 89-term paper decoder covering every gap above, including Bayesian terms, fragility index, competing risks, IV/MR, DiD, calibration and reporting guidelines.

Still not covered by the new content and worth a future module: a Bayesian trial paper (#28), a prediction-model development/validation paper (#22–23), a difference-in-differences policy paper (#18), a competing-risks figure (#8), and a cluster RCT with ICC (#31).
