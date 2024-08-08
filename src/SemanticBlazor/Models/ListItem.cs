using System;
using System.Collections.Generic;
using System.Text;

namespace SemanticBlazor.Models
{
  public class ListItem<TValue> : IEquatable<ListItem<TValue>>
  {
    public TValue Value { get; set; }
    public string Text { get; set; }
    public object Model { get; set; }

    public override string ToString()
    {
      return !string.IsNullOrEmpty(Value.ToString()) ? Value.ToString() : Text;
    }

    public bool Equals(ListItem<TValue> other)
    {
      if (ReferenceEquals(null, other)) return false;
      if (ReferenceEquals(this, other)) return true;
      return Value.ToString() == other.Value.ToString() && Text == other.Text && Equals(Model, other.Model);
    }

    public override bool Equals(object obj)
    {
      if (ReferenceEquals(null, obj)) return false;
      if (ReferenceEquals(this, obj)) return true;
      if (obj.GetType() != this.GetType()) return false;
      return Equals((ListItem<TValue>) obj);
    }

    public override int GetHashCode()
    {
      return HashCode.Combine(Value, Text, Model);
    }
  }
}
