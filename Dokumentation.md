# Dokumentation Web Programmierung

Team besteht aus Timo Haberkorn (Matrikelnummer: 5372587) und Niclas Schmidt (Matrikelnummer: 1949875).

## 1 Backend

### 1.1 Datenbank

Für die Datenbank nutzen wir better-sqlite3, da man hierfür keine zusätzlichen Docker-Container bereitstellen muss und man durch das SQLite Viewer Addon die Datenbank auch in VS Code betrachten kann.
Wir benutzen eine offer-Table für die Angebote, eine customer-Table für die Kunden, eine documents-Table für die Dokumente und eine comments-Table für die Kommentare. Dokumente und Kommentare haben wir ausgelagert, um die Angebot-Table nicht zu überfüllen und Übersichtlichkeit zu gewährleisten. Auf die einzelnen Eigenschaften der Tables wird über Kommentare in der **database.js** eingegangen.

### 1.2 RESTful API

Für die Schnittstelle nutzen wir Fastify und für den Aufbau der Funktionen, Schemas und Routen haben wir uns an der Beer-Solution aus den Vorlesungen orientiert. Error-Handling wird größtenteils bereits durch Fastify bereitgestellt - weitere Fehler wurden allerdings ebenfalls in den Routes genauer spezifiziert.

### 1.3 Filterung

Die Filterung der Daten bei GET-Requests wird durch Query-Parameter gelöst. Bei der Anfrage in Bruno können Query-Parameter gesetzt werden um z.B. alle Offer mit der Currenzy "USD" auszugeben.

### 1.4 Upload von Dateien

Wie von Ihnen empfohlen nutzen wir für den Upload der Dokumente unter anderem fs/promises. Weitere wichtige Module für den Upload sind multipart (ermöglicht File-Upload als Multipart-Objekt), uuid (zum Abspeichern der Datei mit einer unique ID), sowie path und url (zum abspeichern der Datei). 

### 1.5 Authorization

Der User hat je nach mitgeschicktem Authorization-Header nur Zugriff auf bestimmte Operationen. Die Berechtigungen sind in **authorization.js** definiert - der User kann nur GET-Requests schicken; der Developer kann Legacy-Daten einpflegen und Test-Daten generieren, sowie Comments und Dokumente hochladen, bearbeiten und löschen; der Account-Manager hat Zugriff auf alle Operationen außer den Legacy-Import und das Generieren von Test-Daten. Die Authorization-Header werden über einen prehandler-Hook in der **server.js** geprüft und die Berechtigungen, werden bei jeder Route überprüft.

### 1.6 Sicherheit

Zur Absicherung gegen SQL-Injections werden vorbereitete SQL-Queries und Platzhalter genutzt - damit werden die Eingabewerte als Daten statt SQL-Anweisungen behandelt und verhindern somit SQL-Injections. Weiterhin nutzen wir CORS in der **server.js** um Kommunikation nur über das Frontend zuzulassen (Kommunikation über Bruno ist natürlich trotzdem möglich).

## 2 Frontend

### 2.1 A0: Wahl des Frameworks

Nachdem erstellen des Backends wurde sich ans Frontend rangewagt. 

Hierfür haben wir uns für das Framework React und @materialUI (mui) entschieden, da uns dies ein Komilitone empfohlen hat.
Der Frontend server läuft über Vite + Config + React.

Vorteile wären: 
- Material Design – Moderne, ansprechende UI-Komponenten basierend auf Googles Designrichtlinien.
- Anpassbarkeit – Themes, Styles und eigene Komponenten lassen sich leicht erstellen.
- Schnelle Entwicklung – Vorgefertigte Komponenten sparen viel Zeit.
- Server-Side Rendering (SSR) Support – Kompatibel mit Next.js & anderen SSR-Technologien.
- TypeScript-Unterstützung – Typensicherheit für bessere Code-Qualität.
- Gute Dokumentation – Umfassende Guides, Beispiele und API-Referenzen.
- Flexibles Styling – Unterstützung für Emotion, Styled Components & SX Prop.

Im Anschluss haben wir uns Gedanken gemacht wie unsere Seite ausschauen soll und haben uns für ein Dashboard entschieden.

Als Vorlage hat uns folgender Link gedient: **https://mui.com/material-ui/getting-started/templates/** 

Im Anschluss haben wir dateien ausgemistet die wir definitiv nicht benötigen würden und unseren individuellen Bedürfnissen angepasst.
Im anschluss wurde die **Dashboard.tsx** in die **App.tsx** eingefügt.

### 2.2 A1: Kommunikation mit Schnittstelle

Die Schnittstellen sind zu finden unter: **frontend/src/services**

Die **api.tsx** beschreibt die Schnittstellen der Funktionen, die im Backend festgelegt worden sind.
**ErrorContext.tsx** beschreibt das Error Handling und **RoleContext** wird relevant für **A6**

### 2.3 A2: Component Based User Interface

Hier haben wir dann angefangen unsere Website zu designen. Hierfür haben wir das "Szenario" hinzugezogen und haben angefangen die Components zu erstellen mit den Dateien **CustomerList.tsx, CustomerGrid.tsx, OffersList.tsx, OffersGrid.tsx**. Außerdem haben wir hier auch die ersten Routen festgelegt mit **/offers** und **/customer**. Somit wurden auch offers und customer in der sidebar zu Buttons umgewandelt. Bei klicken von Offers werden die beiden Offers Dateien geladen. In **OffersGrid.tsx** sind die Akkordions festgelegt. Dort sind auf der Website alle Offers mit ihrem Status zu sehen. Außerdem wurde der Add Offers Button hinzugefügt, in welchem das Modal geöffnet wird ein neues Offer anzulegen. Hier kann man auch aus bestehenden Kunden auswählen und die ID wird automatisch hinzugefügt. Im Anschluss erscheint ein weiteres Modal um Dateien hochzuladen oder einen Kommentar hinzuzufügen. Selbiges gilt für **CustomerGrid.tsx**. In den beiden **-List.tsx** werden die allgemeinen Sachen definiert wie der Edit oder Delete Button oder Inspect Button. Bei Edit öffnet sich erneut ein Modal zum bearbeiten. Bei delete eine confirm Nachricht ob man sich auch wirklich sicher ist. Nach bestätigen wird der Customer gelöscht. 

### 2.4 A3: Navigation
Diese Aufgabe haben wir zum Schluss behandelt. Natürlich wurden bereits zuvor Routen festgelegt. Hier haben wir den beiden Inspect Knöpfen eine URL mitgegeben. **/offer-deteails/:id** und **/customer/:id**
Hier wird eine neue Seite geladen. 2 neue Dateien wurden erstellt: **CustomerDetails.tsx** und **OffersDetails.tsx**
Zuvor wurde allerdings die Navigation in den jeweiligen **-Grid.tsx** festgelegt, sowie der Button.
In CustomerDetails, wird alles nach den Anforderungen angelegt mit einem weiteren Edit und Save Button. Ein weiteres Akkordeon darunter blendet die Details der laufenden Offers zu dem jeweiligen Kunden ein
In OfferDetails werden die Daten zum Offer angezeigt, diese können auch per Edit Knopf geändert werden. Außerdem kann man per Button den Status ändern und das Offer per Delete Knopf löschen. Darunter werden in Akkordeons Dokumente und Comments zum Offer gefetched. Diese kann man dann ebenfalls editieren, löschen oder neue Dokumente oder Comments anlegen.

### 2.5 A4: User Experience
Hier wurde im **Dashboard.tsx** der Header und Footer festgelegt. Außerdem wurde auch das SideMenu mit der Navigation eingefügt. Dass Dashboard wird dann mit allen Daten in der **App.tsx** ausgegeben

### 2.6 A5: Umsetzung Prototyp
Bei dieser Aufgabe war bereits einiges implementiert aufgrund des Szenarios und vorheriger Aufgaben. Angestellte können Kunden anlegen und verwalten; selbiges für Angebote: Bereits erledigt in **2.2.3**
über den Change Status Button.
Außerdem ist es möglich direkt nach Anlage ein Dokument hochzuladen, aber auch bei der Detailansicht (siehe **OfferDetails.tsx**) können Documents direkt zum Offer hochgeladen werden.
Offer werden nach Erstellungsdatum sortiert und Customer nach Revenue (Summe aller Prices der Offer).
Auf Eis liegende Angebote werden optional angezeigt mit einem Akkordion, das selbe gilt auch für **InProgess und Active**. diese können optional ausgeklappt werden. Außerdem werden die Angebote in **draft** auch angezeigt. Allerdings kann man diese auch einklappen falls der Anwender sich eine andere Ansicht wie die von nur **On_Ice** anschauen möchte. 
Außerdem zeigt die Website nur Daten und Funktionalitäten die auf die Rolle zugeschnitten sind. Der Basic User sieht beispielsweise dass sich an einer Stelle ein Button befindet. Allerdings ist dieser ausgegraut mit einer Nachricht dass dieser user nicht die nötigen Permissions hat diesen Knopf zu drücken.

### 2.7 A6: Rollen Wechseln
Unten links im SideMenu kann der User zwischen den Rollen wechseln um auf bestimmte Features Zugriff zu erhalten. Ändert man die Rolle, sendet die API Schnittstelle dementsprechend einen anderen Authorization-Header.

## Ausblick für zukünftige Erweiterungen
Die Softwarelösung könnte noch mit einer tatsächlichen User- und Rollen-Logik erweitert werden (Login, zentrale Rollenverteilung). Das Design des Frontends könnte natürlich noch professioneller gestaltet werden (von einem kreativeren Designer als wir es sind). Weiter Features, wie z.B. automatische Bestätigungsmails an Kunden (bei Aktivnahme des Angebots), Berichte und Analytics, Workflows, ein Benachrichtigungssystem u.v.m. wären natürlich ebenfalls für zukünftige Erweiterungen möglich.

## Hinweis zur Nutzung von AI-Tools
Wir haben den GitHub-Copilot für Debugging oder Anpassen von Code benutzt der stets gleich aufgebaut ist (z.B. Schemas, Routes oder CRUD-Funktionen) - hierbei wurde Code z.B. für Customer von uns erstellt und dieser dann durch AI auf die anderen Entitäten umgemünzt. Hierbei haben wir stets darauf geachtet, den Code auf Fehler oder unsinnige Passagen überprüft. Ebenfalls haben wir AI genutzt um im Frontend bestimmte Layouts zu erstellen oder die API-Schnittstellen aus unseren Backend-Routes zu erstellen.