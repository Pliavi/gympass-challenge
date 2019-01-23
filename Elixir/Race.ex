defmodule Race do
  def main(path) do
    sorted_values = File.stream!(path)
    |> Stream.drop(1)
    |> Stream.map(&String.trim/1)
    |> Stream.map(&Regex.split(~r{\s–\s|\s+}, &1))
    |> Stream.map(&format_lap_info/1)
    |> Enum.sort(&fastest/2)

    initial_data = %{
      laps: length(sorted_values)
    }

    sorted_values
    |> Enum.reduce(initial_data, &create_result/2)
  end

  defp create_result(value, acc) do
    position = Map.get(acc, :position, 0)

    id = Enum.at(value, 1)
    name = Enum.at(value, 2)
    lap = Enum.at(value, 3)

    result = [id]
    |> Kernel.++([position])
    |> Kernel.++([name])
    |> Kernel.++([lap])

    position =
    if Map.has_key?(acc, id) do
      position
    else
      position + 1
    end

    Map.put(acc, id, result)
    |> Map.put(:position, position)
  end

  defp fastest(info1, info2) do
    [hour1, lap1] = [Enum.at(info1, 0), Enum.at(info1, 3)]
    [hour2, lap2] = [Enum.at(info2, 0), Enum.at(info2, 3)]

    cond do
      lap1 > lap2 -> true
      lap1 < lap2 -> false
      lap1 == lap2 && hour1 < hour2 -> true
      true -> false
    end
  end

  def format_lap_info(lap_info) do
    lap_info
    |> List.update_at(0, &convert_time_to_seconds/1)
    |> List.update_at(3, &String.to_integer/1)
    |> List.update_at(4, &convert_time_to_seconds/1)
    |> List.update_at(5, &String.to_float/1)
  end

  defp convert_time_to_seconds(time) do
    time
    |> String.replace(":", "")
    |> Float.parse()
    |> Kernel.elem(0)
    |> Float.round(3)
  end
end
