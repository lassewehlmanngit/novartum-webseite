---
title: "Vorsicht Falle: Die neue Oracle Java Metrik"
date: "2025-01-15"
author: "Dr. Michael Weber"
authorRole: "Senior Consultant"
category: "Software Asset Management"
readTime: "4 Min"
image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1080&auto=format&fit=crop"
excerpt: "Seit dem Lizenzwechsel bebt der Markt. Warum die 'Employee'-Metrik für viele Unternehmen zur Kostenfalle wird."
tags: ["Oracle", "Java", "Audit", "Licensing"]
tldr: "Oracle berechnet Java jetzt nach der Gesamtzahl der Mitarbeiter, nicht mehr nach Nutzern. Dies kann die Kosten verzehnfachen. Ein Wechsel zu OpenJDK ist oft die einzige wirtschaftliche Lösung."
faq:
  - question: "Ist Java nicht mehr kostenlos?"
    answer: "Java SE ist für viele kommerzielle Einsatzzwecke kostenpflichtig. Kostenlos sind oft nur Development-Umgebungen oder bestimmte ältere Versionen, abhängig vom genauen Oracle-Vertrag."
  - question: "Was ist die Oracle Employee Metric?"
    answer: "Das ist ein Lizenzmodell, bei dem alle Mitarbeiter des Unternehmens lizenziert werden müssen, unabhängig davon, ob sie Java tatsächlich nutzen. Dies gilt auch für Teilzeitkräfte und Auftragnehmer."
---

<p class="mb-4">
  Lange war Java "kostenlos". Dann kam die Subscription. Jetzt kommt die "Employee"-Metrik. Oracle hat das Lizenzmodell radikal vereinfacht – zu Gunsten des eigenen Umsatzes.
</p>
<h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">Was bedeutet "Employee" genau?</h3>
<p class="mb-4">
  Es zählt nicht, wer Java nutzt. Es zählen:
  <br />
  1. Alle Vollzeitmitarbeiter
  <br />
  2. Alle Teilzeitmitarbeiter
  <br />
  3. Alle externen Berater und Kontraktoren, die Systeme des Unternehmens nutzen.
</p>
<p class="mb-4">
  Für ein Unternehmen mit 10.000 Mitarbeitern, von denen nur 50 Java nutzen, ist dieses Modell katastrophal.
</p>
<div class="bg-orange-50 p-6 rounded-xl border border-orange-100 my-6">
  <h4 class="font-bold text-orange-800 mb-2">Unsere Empfehlung</h4>
  <p class="text-sm text-orange-900">
    Prüfen Sie sofort Ihre Java-Installationen. Migrieren Sie Workloads auf OpenJDK (z.B. Adoptium, Amazon Corretto), bevor der nächste Audit-Brief eintrifft.
  </p>
</div>

