Module ArrayExtension
    <System.Runtime.CompilerServices.Extension>
    Public Iterator Function AsList(Of T)(array As IEnumerable) As IEnumerable(Of T)
        For Each item In array
            Yield item
        Next
    End Function
    <System.Runtime.CompilerServices.Extension>
    Public Function Reduce(Of T, TSum)(array As IEnumerable(Of T), method As Func(Of T, TSum, TSum), initial As TSum) As TSum
        Dim sum = initial
        For Each item In array
            sum = method(item, sum)
        Next
        Return sum
    End Function
End Module
Module JQuery
    <System.Runtime.CompilerServices.Extension()>
    Public Iterator Function Find(_xmlNode As Xml.XmlNode, value As String) As IEnumerable(Of Xml.XmlElement)
        Dim regAttr As New System.Text.RegularExpressions.Regex("\[(\w+)(|=""([^""]+)"")\]")
        Dim regNode As New System.Text.RegularExpressions.Regex("^(\w+)")
        Dim nodeType As String = Nothing
        Dim attrs As New Dictionary(Of String, String)

        Console.WriteLine("node:")
        For Each match As System.Text.RegularExpressions.Match In regNode.Matches(value)
            nodeType = match.Groups(1).Value
            Console.WriteLine(nodeType)
        Next
        Console.WriteLine("attrs")
        For Each match As System.Text.RegularExpressions.Match In regAttr.Matches(value)
            Console.WriteLine(match.Groups(3).Value.Length)
            attrs.Add(match.Groups(1).Value, match.Groups(3).Value)
        Next
        Dim searchAttributes = Function(keyvalue As KeyValuePair(Of String, String), attributes As Xml.XmlAttributeCollection) As Boolean
                                   Dim _Key = keyvalue.Key
                                   Dim _Value = keyvalue.Value
                                   If _Value.Length = 0 Then
                                       Return attributes.AsList(Of Xml.XmlAttribute).Any(Function(obj) obj.Name = _Key)
                                   Else
                                       Return attributes.AsList(Of Xml.XmlAttribute).Any(Function(obj) obj.Name = _Key And obj.Value = _Value)
                                   End If
                               End Function
        Dim searchNode As Func(Of Xml.XmlNode, IEnumerable(Of Xml.XmlNode))
        searchNode = Iterator Function(node As Xml.XmlNode) As IEnumerable(Of Xml.XmlNode)
                         Dim found As Boolean = True
                         If nodeType IsNot Nothing Then found = found AndAlso node.Name = nodeType
                         If attrs.Count > 0 Then
                             found = found AndAlso attrs.All(Function(keyvalue As KeyValuePair(Of String, String)) searchAttributes(keyvalue, node.Attributes))
                         End If
                         If found Then Yield node
                         For Each child As Xml.XmlNode In node.ChildNodes
                             For Each node In searchNode(child)
                                 Yield node
                             Next
                         Next
                     End Function
        For Each node In searchNode(_xmlNode)
            Yield node
        Next

    End Function
End Module