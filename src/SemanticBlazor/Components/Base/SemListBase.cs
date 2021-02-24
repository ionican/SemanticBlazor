﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using SemanticBlazor.Models;

namespace SemanticBlazor.Components.Base
{
  public class SemListBase<ItemType> : SemControlBase
  {
    protected List<ItemType> allItems { get; set; } = new List<ItemType>();
    protected IEnumerable<ItemType> currentItems { get; set; }
    [Parameter]
    public List<ItemType> Items
    {
      get
      {
        return allItems;
      }
      set
      {
        if (DataMethod != null) throw new Exception("Items cannot be set when DataMethod is defined");
        if (allItems != value)
        {
          allItems = value;
          pageIndex = 0;
          GetData();
        }
      }
    }
    [Parameter] public Func<DataMethodParams, Task<List<ItemType>>> DataMethod { get; set; }
    [Parameter] public Func<Task<int>> CountMethod { get; set; }
    [Parameter] public EventCallback<int> PageIndexChanged { get; set; }

    [Parameter] public bool AllowPaging { get; set; }
    [Parameter] public int DefaultPageSize { get; set; } = 5;

    protected int pageSize { get; set; }
    protected int pageIndex { get; set; } = 0;
    protected int totalPages { get; set; } = 0;
    protected int pagerStart = 0;
    protected bool loading = false;

    protected override async Task OnInitializedAsync()
    {
      pageIndex = 0;
      pageSize = DefaultPageSize;
      await GetData();
    }
    public virtual async Task SetPageIndex(int newPageIndex)
    {
      pageIndex = newPageIndex;
      await PageIndexChanged.InvokeAsync(pageIndex);
      await GetData();
    }
    public void SetLoadingState(bool isLoading)
    {
      this.loading = isLoading;
      StateHasChanged();
    }
    public async Task RefreshData(bool resetPaging = true)
    {
      loading = true;
      if (resetPaging) pageIndex = 0;
      allItems = null;
      await GetData();
    }
    async Task GetData()
    {
      loading = true;
      StateHasChanged();
      //await Task.Delay(10); //Čekáním se uvolní vlákno a nastaví se loading třída uživateli

      if (AllowPaging)
      {
        if (CountMethod != null)
        {
          // Pokud je definová metoda na count, tak se používá stránkování na serveru (API)
          var _itemsCount = await CountMethod();
          totalPages = (int)Math.Ceiling((decimal)_itemsCount / (decimal)pageSize);
          currentItems = await CallDataMethod(new DataMethodParams() { StartRowIndex = pageIndex * pageSize, MaximumRows = pageSize });
        }
        else
        {
          // Pokud nneí definová metoda na count, tak se načtou všechna data a stránkuje se na klientovi
          if (DataMethod != null && (allItems == null || allItems.Count == 0))
          {
            allItems = await CallDataMethod(new DataMethodParams() { StartRowIndex = 0, MaximumRows = int.MaxValue });
          }
          totalPages = (int)Math.Ceiling((decimal)(allItems?.Count() ?? 0) / (decimal)pageSize);
          currentItems = allItems?.Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }
      }
      else
      {
        if (DataMethod != null) allItems = await CallDataMethod(new DataMethodParams() { StartRowIndex = 0, MaximumRows = int.MaxValue });
        currentItems = allItems;
      }
      loading = false;
      //Musí se refreshonout State, jinak se na formuláři role nerefreshuje grid
      StateHasChanged();
    }
    async Task<List<ItemType>> CallDataMethod(DataMethodParams e)
    {
      List<ItemType> retval;
      retval = await DataMethod(e);
      if (retval == null) retval = new List<ItemType>();
      return retval;
    }
  }
}
