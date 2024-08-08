using Microsoft.AspNetCore.Components;
using SemanticBlazor.Models;
using System;
using System.Collections.Generic;
using SemanticBlazor.Components.Base.Dropdown;

namespace SemanticBlazor.Components
{
  public class SemDropdownSelection<TValue> : SemDropdownSingleSelectionBase<ListItem<TValue>, TValue>
  {
    #region ListItems
    [Obsolete]
    [Parameter] public override IEnumerable<ListItem<TValue>> Items { get; set; }
    [Parameter] public override RenderFragment ListItems { get; set; }
    #endregion
  }
}