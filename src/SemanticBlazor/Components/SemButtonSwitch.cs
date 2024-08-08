using Microsoft.AspNetCore.Components;
using SemanticBlazor.Models;
using System;
using System.Collections.Generic;
using System.Text;
using SemanticBlazor.Components.Base.ButtonSwitch;

namespace SemanticBlazor.Components
{
  public class SemButtonSwitch<TValue> : SemButtonSwitchBase<ListItem<TValue>, TValue>
  {
    #region ListItems
    [Obsolete]
    [Parameter] public override IEnumerable<ListItem<TValue>> Items { get; set; }
    [Parameter] public override RenderFragment<object> ItemTemplate { get; set; }
    [Parameter] public override RenderFragment ListItems { get; set; }
    #endregion
  }
}
