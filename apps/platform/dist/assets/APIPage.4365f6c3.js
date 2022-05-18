import{r as A,bs as z,m as H,j as o,b as j,a as d,T as c,L as p,G as x,aC as v,aQ as J}from"./index.ec2996a9.js";import{A as k,a as f,d as g,b as S}from"./graphiql.min.35449f36.js";var E={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"associatedDiseases"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"target"},arguments:[{kind:"Argument",name:{kind:"Name",value:"ensemblId"},value:{kind:"StringValue",value:"ENSG00000127318",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"approvedSymbol"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"associatedDiseases"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"count"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"rows"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"disease"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"datasourceScores"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"score"},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:286}};E.loc.source={body:`query associatedDiseases {
  target(ensemblId: "ENSG00000127318") {
    id
    approvedSymbol
    associatedDiseases {
      count
      rows {
        disease {
          id
          name
        }
        datasourceScores {
          id
          score
        }
      }
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function h(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){h(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){h(a,n)}),e.definitions&&e.definitions.forEach(function(a){h(a,n)})}var T={};(function(){E.definitions.forEach(function(n){if(n.name){var i=new Set;h(n,i),T[n.name.value]=i}})})();function Q(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function K(e,n){var i={kind:e.kind,definitions:[Q(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=T[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=T[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=Q(e,t);s&&i.definitions.push(s)}),i}K(E,"associatedDiseases");var D={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"associatedTargets"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"disease"},arguments:[{kind:"Argument",name:{kind:"Name",value:"efoId"},value:{kind:"StringValue",value:"EFO_0000349",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"associatedTargets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"count"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"rows"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"target"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"approvedSymbol"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"score"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:224}};D.loc.source={body:`query associatedTargets {
  disease(efoId: "EFO_0000349") {
    id
    name
    associatedTargets {
      count
      rows {
        target {
          id
          approvedSymbol
        }
        score
      }
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function F(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){F(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){F(a,n)}),e.definitions&&e.definitions.forEach(function(a){F(a,n)})}var $={};(function(){D.definitions.forEach(function(n){if(n.name){var i=new Set;F(n,i),$[n.name.value]=i}})})();function V(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function U(e,n){var i={kind:e.kind,definitions:[V(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=$[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=$[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=V(e,t);s&&i.definitions.push(s)}),i}U(D,"associatedTargets");var R={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"targetDiseaseEvidence"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"disease"},arguments:[{kind:"Argument",name:{kind:"Name",value:"efoId"},value:{kind:"StringValue",value:"EFO_0005952",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"evidences"},arguments:[{kind:"Argument",name:{kind:"Name",value:"datasourceIds"},value:{kind:"ListValue",values:[{kind:"StringValue",value:"intogen",block:!1}]}},{kind:"Argument",name:{kind:"Name",value:"ensemblIds"},value:{kind:"ListValue",values:[{kind:"StringValue",value:"ENSG00000172936",block:!1}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"count"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"rows"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"disease"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"diseaseFromSource"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"target"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"approvedSymbol"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"mutatedSamples"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"functionalConsequence"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"label"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"numberSamplesTested"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"numberMutatedSamples"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"resourceScore"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"significantDriverMethods"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"cohortId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"cohortShortName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"cohortDescription"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:646}};R.loc.source={body:`query targetDiseaseEvidence {
  disease(efoId: "EFO_0005952") {
    id
    name
    evidences(datasourceIds: ["intogen"], ensemblIds: ["ENSG00000172936"]) {
      count
      rows {
        disease {
          id
          name
        }
        diseaseFromSource
        target {
          id
          approvedSymbol
        }
        mutatedSamples {
          functionalConsequence {
            id
            label
          }
          numberSamplesTested
          numberMutatedSamples
        }
        resourceScore
        significantDriverMethods
        cohortId
        cohortShortName
        cohortDescription
      }
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function N(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){N(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){N(a,n)}),e.definitions&&e.definitions.forEach(function(a){N(a,n)})}var L={};(function(){R.definitions.forEach(function(n){if(n.name){var i=new Set;N(n,i),L[n.name.value]=i}})})();function M(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function X(e,n){var i={kind:e.kind,definitions:[M(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=L[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=L[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=M(e,t);s&&i.definitions.push(s)}),i}X(R,"targetDiseaseEvidence");var O={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"targetAnnotation"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"target"},arguments:[{kind:"Argument",name:{kind:"Name",value:"ensemblId"},value:{kind:"StringValue",value:"ENSG00000169083",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"approvedSymbol"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"tractability"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"modality"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"safetyLiabilities"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"event"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"eventId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"biosample"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cellFormat"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"cellLabel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"tissueLabel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"tissueId"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"effects"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"dosing"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"direction"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"study"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"type"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"datasource"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"literature"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:474}};O.loc.source={body:`query targetAnnotation {
  target(ensemblId: "ENSG00000169083") {
    id
    approvedSymbol
    tractability {
      modality
      id
      value
    }
    safetyLiabilities {
      event
      eventId
      biosample {
        cellFormat
        cellLabel
        tissueLabel
        tissueId
      }
      effects {
        dosing
        direction
      }
      study {
        name
        type
        description
      }
      datasource
      literature
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function y(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){y(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){y(a,n)}),e.definitions&&e.definitions.forEach(function(a){y(a,n)})}var P={};(function(){O.definitions.forEach(function(n){if(n.name){var i=new Set;y(n,i),P[n.name.value]=i}})})();function _(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function Y(e,n){var i={kind:e.kind,definitions:[_(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=P[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=P[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=_(e,t);s&&i.definitions.push(s)}),i}Y(O,"targetAnnotation");var q={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"diseaseAnnotation"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"disease"},arguments:[{kind:"Argument",name:{kind:"Name",value:"efoId"},value:{kind:"StringValue",value:"MONDO_0005301",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"phenotypes"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"rows"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"phenotypeHPO"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"namespace"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"phenotypeEFO"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"evidence"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"aspect"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"bioCuration"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"diseaseFromSourceId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"diseaseFromSource"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"evidenceType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"frequency"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"frequencyHPO"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"qualifierNot"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"onset"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"modifiers"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"references"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sex"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"resource"},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:735}};q.loc.source={body:`query diseaseAnnotation {
  disease(efoId: "MONDO_0005301") {
    id
    name
    phenotypes {
      rows {
        phenotypeHPO {
          id
          name
          description
          namespace
        }
        phenotypeEFO {
          id
          name
        }
        evidence {
          aspect
          bioCuration
          diseaseFromSourceId
          diseaseFromSource
          evidenceType
          frequency
          frequencyHPO {
            name
            id
          }
          qualifierNot
          onset {
            name
            id
          }
          modifiers {
            name
            id
          }
          references
          sex
          resource
        }
      }
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function b(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){b(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){b(a,n)}),e.definitions&&e.definitions.forEach(function(a){b(a,n)})}var C={};(function(){q.definitions.forEach(function(n){if(n.name){var i=new Set;b(n,i),C[n.name.value]=i}})})();function W(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function Z(e,n){var i={kind:e.kind,definitions:[W(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=C[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=C[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=W(e,t);s&&i.definitions.push(s)}),i}Z(q,"diseaseAnnotation");var I={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"drugApprovalWithdrawnWarningData"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"drug"},arguments:[{kind:"Argument",name:{kind:"Name",value:"chemblId"},value:{kind:"StringValue",value:"CHEMBL118",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isApproved"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"hasBeenWithdrawn"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"blackBoxWarning"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"drugWarnings"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"warningType"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"toxicityClass"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"meddraSocCode"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"year"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"references"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"source"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:328}};I.loc.source={body:`query drugApprovalWithdrawnWarningData {
  drug(chemblId: "CHEMBL118") {
    name
    id
    isApproved
    hasBeenWithdrawn
    blackBoxWarning
    drugWarnings {
      warningType
      description
      toxicityClass
      meddraSocCode
      year
      references {
        id
        source
        url
      }
    }
  }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function w(e,n){if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){var i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(a){w(a,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(a){w(a,n)}),e.definitions&&e.definitions.forEach(function(a){w(a,n)})}var G={};(function(){I.definitions.forEach(function(n){if(n.name){var i=new Set;w(n,i),G[n.name.value]=i}})})();function B(e,n){for(var i=0;i<e.definitions.length;i++){var a=e.definitions[i];if(a.name&&a.name.value==n)return a}}function ee(e,n){var i={kind:e.kind,definitions:[B(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);var a=G[n]||new Set,l=new Set,r=new Set;for(a.forEach(function(t){r.add(t)});r.size>0;){var u=r;r=new Set,u.forEach(function(t){if(!l.has(t)){l.add(t);var s=G[t]||new Set;s.forEach(function(m){r.add(m)})}})}return l.forEach(function(t){var s=B(e,t);s&&i.definitions.push(s)}),i}ee(I,"drugApprovalWithdrawnWarningData");const ne=A.exports.lazy(()=>z(()=>import("./index.78390b65.js"),["assets/index.78390b65.js","assets/ToolbarSelect.cd37b9c4.js","assets/index.ec2996a9.js","assets/index.b4f82d15.css"]).then(e=>(e.default.Logo=()=>null,e.default.Toolbar=()=>null,e))),ie=H({container:{minHeight:"600px"},buttonMargin:{marginBottom:"12px"}});function de(){const e=ie(),[n,i]=A.exports.useState(null);return o(j,{children:[d(c,{variant:"h4",paragraph:!0,children:"API"}),o(c,{paragraph:!0,children:["The Open Targets Platform is powered by a GraphQL API that supports graphical queries for a single entity or target-disease association across our knowledge graph. Read our"," ",d(p,{external:!0,to:"https://platform-docs.opentargets.org/data-access/graphql-api",children:"GraphQL API documentation"})," ","and visit the"," ",d(p,{external:!0,to:"https://community.opentargets.org",children:"Open Targets Community"})," ","for more how-to guides and tutorials."]}),o(c,{paragraph:!0,children:["Please note that ur API is optimised for a single query. For more programmatic or systematic analyses, please use"," ",d(p,{external:!0,to:"https://platform-docs.opentargets.org/data-access/datasets",children:"our dataset downloads"})," ","or"," ",d(p,{external:!0,to:"https://platform-docs.opentargets.org/data-access/google-bigquery",children:"Google BigQuery instance"}),"."]}),o(x,{className:e.container,container:!0,spacing:3,children:[o(x,{item:!0,md:3,xl:2,children:[d(c,{variant:"h5",paragraph:!0,children:"Example queries"}),o(k,{children:[d(f,{expandIcon:d(g,{}),children:d(c,{variant:"subtitle2",children:"Target-disease association"})}),d(S,{children:o("div",{children:[d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Find targets associated with a specific disease or phenotype"}),d(v,{className:e.buttonMargin,variant:"contained",color:"primary",onClick:()=>i(D.loc.source.body),children:"Run sample query"}),d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Find diseases and phenotypes associated with a specific target"}),d(v,{variant:"contained",color:"primary",onClick:()=>i(E.loc.source.body),children:"Run sample query"})]})})]}),o(k,{children:[d(f,{expandIcon:d(g,{}),children:d(c,{variant:"subtitle2",children:"Target-disease evidence"})}),d(S,{children:o("div",{children:[d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Explore evidence that supports a specific target-disease association"}),d(v,{className:e.buttonMargin,variant:"contained",color:"primary",onClick:()=>i(R.loc.source.body),children:"Run sample query"})]})})]}),o(k,{children:[d(f,{expandIcon:d(g,{}),children:d(c,{variant:"subtitle2",children:"Target annotation"})}),d(S,{children:o("div",{children:[d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Find tractability and safety information for a specific target"}),d(v,{className:e.buttonMargin,variant:"contained",color:"primary",onClick:()=>i(O.loc.source.body),children:"Run sample query"})]})})]}),o(k,{children:[d(f,{expandIcon:d(g,{}),children:d(c,{variant:"subtitle2",children:"Disease annotation"})}),d(S,{children:o("div",{children:[d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Find clinical signs and symptoms for a specific disease"}),d(v,{className:e.buttonMargin,variant:"contained",color:"primary",onClick:()=>i(q.loc.source.body),children:"Run sample query"})]})})]}),o(k,{children:[d(f,{expandIcon:d(g,{}),children:d(c,{variant:"subtitle2",children:"Drug annotation"})}),d(S,{children:o("div",{children:[d(c,{variant:"subtitle2",display:"block",paragraph:!0,children:"Find approval status and withdrawn and black-box warning for a specific drug"}),d(v,{className:e.buttonMargin,variant:"contained",color:"primary",onClick:()=>i(I.loc.source.body),children:"Run sample query"})]})})]})]}),d(x,{item:!0,md:9,xl:10,children:d(A.exports.Suspense,{fallback:d("div",{children:"Loading..."}),children:d(ne,{fetcher:J,query:n})})})]})]})}export{de as default};
