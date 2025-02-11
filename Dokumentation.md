# Dokumentation Web Programmierung

## 1.Installierte Softwares



## 1.1 Backend starten

zum Ordner backend navigieren im Terminal: **./backend**

Dann müssen alle **npm packages** installiert werden.

**npm install**

Backend Server starten: **npm run start**

## 1.2 Frontend starten 

zum Ordner backend navigieren im Terminal: **./frontend**

Dann müssen alle **npm packages** installiert werden.

**npm install**

Backend Server starten: **npm run dev**
 Local:   **http://localhost:5173/**

## 2. Dokumentation

## 2.1 Backend

## 2.2 Frontend

### 2.2.1 A0: Wahl des Frameworks

Nachdem erstellen des Backends wurde sich ans Frontend rangewagt. 

Hierfür haben wir uns für das Framework React und @materialUI (mui) entschieden, da uns dies ein Komilitone empfohlen wird.
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

### 2.2.2 A1: Kommunikation mit Schnittstelle

Die Schnittstellen sind zu finden unter: **frontend/src/services**

Die **api.tsx** beschreibt die Schnittstellen der Funktionen, die im Backend festgelegt worden sind.
**ErrorContext.tsx** beschreibt das Error Handling und **RoleContext** wird relevant für **A6**

### 2.2.3 A2: Component Based User Interface

Hier haben wir dann angefangen unsere Website zu designen. Hierfür haben wir das "Szenario" hinzugezogen und haben angefangen die Components zu erstellen mit den Dateien **CustomerList.tsx, CustomerGrid.tsx, OffersList.tsx, OffersGrid.tsx**. Außerdem haben wir hier auch die ersten Routen festgelegt mit **/offers** und **/customer**. Somit wurden auch offers und customer in der sidebar zu Buttons umgewandelt. Bei klicken von Offers werden die beiden Offers Dateien geladen. In **OffersGrid.tsx** sind die Akkordions festgelegt. Dort sind auf der Website alle Offers mit ihrem Status zu sehen. Außerdem wurde der Add Offers Button hinzugefügt, in welchem das Modal geöffnet wird ein neues Offer anzulegen. Hier kann man auch aus bestehenden Kunden auswählen und die ID wird automatisch hinzugefügt. Im Anschluss erscheint ein weiteres Modal um Dateien hochzuladen oder einen Kommentar hinzuzufügen. Selbiges gilt für **CustomerGrid.tsx**. In den beiden **-List.tsx** werden die allgemeinen Sachen definiert wie der Edit oder Delete Button oder Inspect Button. Bei Edit öffnet sich erneut ein Modal zum bearbeiten. Bei delete eine confirm Nachricht ob man sich auch wirklich sicher ist. Nach bestätigen wird der Customer gelöscht. 

### 2.2.4 A3: Navigation
Diese Aufgabe haben wir zum Schluss behandelt. Natürlich wurden bereits zuvor Routen festgelegt. Hier haben wir den beiden Inspect Knöpfen eine URL mitgegeben. **/offer-deteails/:id** und **/customer/:id**
Hier wird eine neue Seite geladen. 2 neue Dateien wurden erstellt: **CustomerDetails.tsx** und **OffersDetails.tsx**
Zuvor wurde allerdings die Navigation in den jeweiligen **-Grid.tsx** festgelegt, sowie der Button.
In CustomerDetails, wird alles nach den Anforderungen angelegt mit einem weiteren Edit und Save Button. Ein weiteres Akkordeon darunter blendet die Details der laufenden Offers zu dem jeweiligen Kunden ein
--OfferDeatils.tsx-- hier Niclas Text einfügen

### 2.2.5 A4: User Experience
Hier wurde im **Dashboard.tsx** der Header und Footer festgelegt. Außerdem wurde auch das SideMenu mit der Navigation eingefügt. Dass Dashboard wird dann mit allen Daten in der **App.tsx** ausgegeben

### 2.2.6 A5: Umsetzung Prototyp
Bei dieser Aufgabe war bereits einiges implementiert aufgrund des Szenarios und vorheriger Aufgaben. Angestellte können Kunden anlegen und verwalten; selbiges für Angebote: Bereits erledigt in **2.2.3**
--Angebote in die beschriebenen Zustände setzen-- Hier niclas Text einfügen
Außerdem ist es möglich direkt nach Anlage ein Dokument hochzuladen, aber auch bei der Detailansicht (siehe **OfferDetails.tsx**--evtl auch hier was Niclas--)
--.Neue Angebote; sowie der Umsatz und so musst du wieder beschreiben Niclas--
Auf Eis liegende Angebote werden optional angezeigt mit einem Akkordion, das selbe gilt auch für **InProgess und Active**. diese können optional ausgeklappt werden. Außerdem werden die Angebote in **draft** auch angezeigt. Allerdings kann man diese auch einklappen falls der Anwender sich eine andere Ansicht wie die von nur **On_Ice** anschauen möchte. 
Außerdem zeigt die Website nur Daten und Funktionalitäten die auf die Rolle zugeschnitten sind. Der Basic User sieht beispielsweise dass sich an einer Stelle ein Button befindet. Allerdings ist dieser ausgegraut mit einer Nachricht dass dieser user nicht die nötigen Permissions hat diesen Knopf zu drücken.

### 2.2.7 A6: Rollen Wechseln
--Hier wieder einfügen Niclas--

